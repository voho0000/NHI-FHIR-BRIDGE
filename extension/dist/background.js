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
    const key = [patientId, ...parts].join("|");
    return (0, import_js_sha1.sha1)(key).slice(0, 32);
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
    const patientId = String(raw.identifier ?? raw.id ?? "unknown");
    const rawNameText = (raw.name ?? null) || "Unknown";
    const phone = (raw.phone ?? null) || "";
    const address = (raw.address ?? null) || "";
    const nameText = maskName(rawNameText);
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
          system: looksLikeTwNationalId(patientId) ? TW_NATIONAL_ID : HIS_LOCAL_PATIENT_MRN,
          value: patientId
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
  function _buildOverridePatient(ov) {
    const raw = {
      id: ov.id_no,
      identifier: ov.id_no,
      name: ov.name || ov.id_no
    };
    if (ov.birth_date) raw.birthDate = ov.birth_date;
    if (ov.gender) raw.gender = ov.gender;
    return mapPatient(raw);
  }
  function _assembleLocalBundle(byType, patientOverride) {
    const patient = _buildOverridePatient(patientOverride);
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
  async function _stashFhirBundle(bundle, patientId) {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    const safePid = (patientId || "unknown").replace(/[^A-Za-z0-9_-]/g, "_");
    const filename = `nhi-${safePid}-${ts}.json`;
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
    if (!patientOverride || !patientOverride.id_no) {
      await chrome.storage.local.set({
        syncStatus: {
          running: false,
          progress: "\u26D4 \u8ACB\u5148\u5728 popup \u586B\u5BEB\u75C5\u4EBA\u8CC7\u6599\uFF08\u8EAB\u5206\u8B49\u5B57\u865F\uFF09\u5F8C\u518D\u8A66",
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
      progress: "\u{1F680} \u958B\u59CB\u540C\u6B65\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
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
    let total = 0;
    let _localFilename = null;
    if (mode === "local") {
      if (_cancelled) throw new Error(CANCEL_ERROR);
      await setStatus({ progress: "\u{1F9EC} \u8F49\u63DB\u70BA FHIR Bundle\u2026", totalResources: 0 });
      let bundle;
      try {
        bundle = _assembleLocalBundle(byType, patientOverride);
      } catch (e) {
        errors.push(`local mapping: ${e.message}`);
        bundle = null;
      }
      if (bundle) {
        total = bundle.entry.length;
        await setStatus({ progress: `\u{1F4BE} \u6E96\u5099 ${total} \u7B46 FHIR \u8CC7\u6E90\u2026`, totalResources: total });
        try {
          const dl = await _stashFhirBundle(bundle, patientOverride.id_no);
          _localFilename = dl.filename;
        } catch (e) {
          errors.push(`stash bundle: ${e.message}`);
        }
      }
    } else {
      for (const [page_type, items] of Object.entries(byType)) {
        if (_cancelled) throw new Error(CANCEL_ERROR);
        await setStatus({
          progress: `\u2B06\uFE0F \u4E0A\u50B3 ${page_type}\uFF08${items.length} \u7B46\uFF09\u2026`,
          totalResources: total
        });
        try {
          const data = await _postStructured(backend, page_type, items, syncApiKey, patientOverride);
          total += data.count || 0;
        } catch (e) {
          errors.push(`upload ${page_type}: ${e.message}`);
        }
      }
      if (patientOverride.id_no) {
        try {
          await setStatus({ progress: "\u{1F4E6} \u53D6\u5F97\u5F8C\u7AEF\u5B8C\u6574 Bundle\u2026", totalResources: total });
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
      progress: errors.length ? `\u26A0\uFE0F \u540C\u6B65\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF0C${errors.length} \u9805\u5931\u6557\uFF08${_elapsedStr}\uFF09${_localTail}` : `\u2705 \u540C\u6B65\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF08${_elapsedStr}\uFF09${_localTail}`,
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
          // /sync/log lands in the dashboard's sync-history table; mask
          // the name there too so the dashboard never sees the raw value.
          patient_name: maskName(patientOverride.name || ""),
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
  chrome.runtime.onInstalled.addListener(async () => {
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
                progress: "\u26D4 \u5DF2\u505C\u6B62\u4E26\u6E05\u9664\u90E8\u5206\u540C\u6B65\u8CC7\u6599 \u2014 \u8ACB\u91CD\u65B0\u540C\u6B65",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENlbnRyYWxpc2VkIEZISVIgQ29kZVN5c3RlbSAvIElkZW50aWZpZXJTeXN0ZW0gVVJJcyB1c2VkIGJ5IHRoZSBtYXBwZXJzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL2ZoaXIvc3lzdGVtcy5weWAuIFdlIHVzZSBVUkwtZm9ybSBzeXN0ZW1zIGluc3RlYWRcbiAqIG9mIE9JRHMgYmVjYXVzZTpcbiAqICAgLSBpdCBkb2Vzbid0IHJlcXVpcmUgbWludGluZy9vd25pbmcgYSByZWFsIE5ISS9UVyBjb3JlIE9JRCxcbiAqICAgLSBpdCdzIHNlbGYtZGVzY3JpYmluZyBpbiB0b29scyB0aGF0IGRvbid0IHJlY29nbmlzZSB0aGUgT0lELFxuICogICAtIGl0IGNsZWFubHkgc3Vydml2ZXMgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IncyBzeW50YWN0aWMgY2hlY2suXG4gKlxuICogQWxsIHN5c3RlbXMgbGl2ZSBoZXJlIHNvIGEgc2luZ2xlIGNoYW5nZSByaXBwbGVzIHRvIGV2ZXJ5IG1hcHBlci5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIG5hdGlvbmFsIGNvZGUgc3lzdGVtcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyAobGFiICsgcHJvY2VkdXJlIG9yZGVyIGNvZGVzIFx1MjAxNCBzYW1lIG5hbWVzcGFjZSkuICovXG5leHBvcnQgY29uc3QgTkhJX01FRElDQUxfT1JERVJfQ09ERSA9XG4gIFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktbWVkaWNhbC1vcmRlci1jb2RlXCI7XG5cbi8qKiBcdTUwNjVcdTRGRERcdTdGNzJcdTg1RTVcdTU0QzFcdTRFRTNcdTc4QkMgKGRydWcgY29kZSkuICovXG5leHBvcnQgY29uc3QgTkhJX0RSVUdfQ09ERSA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktZHJ1Zy1jb2RlXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBUYWl3YW4gcGF0aWVudCBpZGVudGlmaWVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiAoVGFpd2FuIG5hdGlvbmFsIElEKS4gKi9cbmV4cG9ydCBjb25zdCBUV19OQVRJT05BTF9JRCA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvSWRlbnRpZmllclN5c3RlbS9uYXRpb25hbC1pZFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgZmFsbGJhY2tzIChwZXItZGVwbG95bWVudCwgTk9UIGNyb3NzLXN5c3RlbSBjYW5vbmljYWwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0xBQl9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1sYWJcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1tZWRpY2F0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1JFUE9SVF9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1yZXBvcnRcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQ09ORElUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWNvbmRpdGlvblwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9QUk9DRURVUkVfQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtcHJvY2VkdXJlXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0FMTEVSR0VOX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWFsbGVyZ2VuXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BBVElFTlRfTVJOID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9JZGVudGlmaWVyU3lzdGVtL2hpcy1tcm5cIjtcblxuLy8gXHUyNTAwXHUyNTAwIEludGVybmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgTE9JTkMgPSBcImh0dHA6Ly9sb2luYy5vcmdcIjtcbmV4cG9ydCBjb25zdCBTTk9NRURfQ1QgPSBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIjtcbi8qKiBJQ0QtMTAtQ00gKFRhaXdhbiAvIFx1NTA2NVx1NEZERCB1c2VzIHRoaXMsIG5vdCBiYXJlIElDRC0xMCkuICovXG5leHBvcnQgY29uc3QgSUNEXzEwX0NNID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIjtcbmV4cG9ydCBjb25zdCBJQ0RfMTBfUENTID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtcGNzXCI7XG4iLCAiLyoqXG4gKiBDcm9zcy1tYXBwZXIgaGVscGVycyBzaGFyZWQgYnkgc2V2ZXJhbCBGSElSIHJlc291cmNlIG1hcHBlcnMuXG4gKi9cblxuaW1wb3J0IHsgc2hhMSB9IGZyb20gXCJqcy1zaGExXCI7XG5cbi8qKlxuICogRGV0ZXJtaW5pc3RpYyAzMi1jaGFyIGhleCBJRCBkZXJpdmVkIGZyb20gdGhlIHBhdGllbnQgSUQgKyBhcmJpdHJhcnlcbiAqIGtleSBwYXJ0cy4gU2FtZSBTSEEtMSArIHRydW5jYXRlLTMyIGFsZ29yaXRobSBhcyB0aGUgUHl0aG9uIG1hcHBlcnNcbiAqIHNvIHJlLXN5bmNzIHVwc2VydCB0aGUgc2FtZSByZXNvdXJjZSBpbnN0ZWFkIG9mIGNyZWF0aW5nIGR1cGxpY2F0ZXMuXG4gKlxuICogVXNlcyBganMtc2hhMWAgKHB1cmUgSlMpIGluc3RlYWQgb2YgYG5vZGU6Y3J5cHRvYCBzbyB0aGUgc2FtZSBtYXBwZXJcbiAqIGNvZGUgcnVucyB1bm1vZGlmaWVkIGluIHRoZSBDaHJvbWUgZXh0ZW5zaW9uJ3MgbG9jYWwtb25seSBtb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhYmxlSWQocGF0aWVudElkOiBzdHJpbmcsIC4uLnBhcnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IGtleSA9IFtwYXRpZW50SWQsIC4uLnBhcnRzXS5qb2luKFwifFwiKTtcbiAgcmV0dXJuIHNoYTEoa2V5KS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCByYXcuY29kZSA/PyBcIlwiLCByYXcub25zZXRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiByYXcuY2xpbmljYWxfc3RhdHVzID8/IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi12ZXItc3RhdHVzXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIENvbmRpdGlvblwiO1xuICBsZXQgY29kZSA9IHJhdy5jb2RlIGFzIHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuICBpZiAoc3lzdGVtID09PSBzeXN0ZW1zLklDRF8xMF9DTSAmJiBjb2RlKSB7XG4gICAgY29kZSA9IG5vcm1hbGl6ZUljZDEwQ20oY29kZSk7XG4gIH1cbiAgcmVzb3VyY2UuY29kZSA9IHtcbiAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgIHRleHQ6IGRpc3BsYXksXG4gIH07XG5cbiAgY29uc3Qgc2V2ZXJpdHkgPSByYXcuc2V2ZXJpdHkgPz8gXCJcIjtcbiAgaWYgKHNldmVyaXR5KSB7XG4gICAgcmVzb3VyY2Uuc2V2ZXJpdHkgPSB7IHRleHQ6IHNldmVyaXR5IH07XG4gIH1cblxuICBpZiAocmF3Lm9uc2V0X2RhdGUpIHtcbiAgICByZXNvdXJjZS5vbnNldERhdGVUaW1lID0gYCR7cmF3Lm9uc2V0X2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBOSEkncyBlbmNvdW50ZXIgXCJ0eXBlXCIgbWFya2VycyBcdTIwMTQgJ0lDXHU1MzYxXHU4Q0M3XHU2NTk5JyAvICdcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTknIC8gJ1x1NEY0Rlx1OTY2MidcbiAgLy8gXHUyMDE0IGFyZSBkYXRhLW9yaWdpbiBsYWJlbHMsIG5vdCBTTk9NRUQgY2xpbmljYWwgdHlwZXMuIEtlZXAgdGhlbSBhc1xuICAvLyBDb2RlYWJsZUNvbmNlcHQudGV4dCB3aXRob3V0IGNsYWltaW5nIFNOT01FRC5cbiAgY29uc3QgdHlwZURpc3BsYXkgPSAoKHJhdy50eXBlX2Rpc3BsYXkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICh0eXBlRGlzcGxheSkge1xuICAgIHJlc291cmNlLnR5cGUgPSBbeyB0ZXh0OiB0eXBlRGlzcGxheSB9XTtcbiAgfVxuXG4gIGNvbnN0IHBlcmlvZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBpZiAocmF3LmRhdGUpIHBlcmlvZC5zdGFydCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuZW5kX2RhdGUpIHBlcmlvZC5lbmQgPSBgJHtyYXcuZW5kX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKE9iamVjdC5rZXlzKHBlcmlvZCkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnBlcmlvZCA9IHBlcmlvZDtcbiAgfVxuXG4gIGNvbnN0IGRlcGFydG1lbnQgPSByYXcuZGVwYXJ0bWVudCA/PyBcIlwiO1xuICBjb25zdCBwcm92aWRlciA9IHJhdy5wcm92aWRlciA/PyBcIlwiO1xuICBpZiAoZGVwYXJ0bWVudCB8fCBwcm92aWRlcikge1xuICAgIGNvbnN0IHBhcnRpY2lwYW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHByb3ZpZGVyKSBwYXJ0aWNpcGFudC5pbmRpdmlkdWFsID0geyBkaXNwbGF5OiBwcm92aWRlciB9O1xuICAgIHJlc291cmNlLnBhcnRpY2lwYW50ID0gT2JqZWN0LmtleXMocGFydGljaXBhbnQpLmxlbmd0aCA+IDAgPyBbcGFydGljaXBhbnRdIDogW107XG4gICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgIHJlc291cmNlLnNlcnZpY2VUeXBlID0geyB0ZXh0OiBkZXBhcnRtZW50IH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2Uuc2VydmljZVByb3ZpZGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgY29uc3QgcmVhc29uID0gcmF3LnJlYXNvbiA/PyBcIlwiO1xuICBpZiAocmVhc29uKSB7XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFt7IHRleHQ6IHJlYXNvbiB9XTtcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogTWVkaWNhdGlvblJlcXVlc3QgbWFwcGVyICsgYmlsaW5ndWFsIGRlZHVwbGljYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL21lZGljYXRpb24ucHlgLiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHJlcG9ydHMgdGhlXG4gKiBTQU1FIHByZXNjcmlwdGlvbiBtdWx0aXBsZSB0aW1lcyAoRW5nbGlzaC1vbmx5IC8gRW5nK1x1NEUyRCAvIFx1NEUyRCtFbmcpLlxuICogYG1hcE1lZGljYXRpb25zRGVkdXBgIGNvbGxhcHNlcyB0aGVzZSB0byBvbmUgTWVkaWNhdGlvblJlcXVlc3QgcGVyXG4gKiAoZGF0ZSwgY2Fub25pY2FsLWRydWcta2V5KSwgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIG1vcmUgQ0pLIGNoYXJzXG4gKiAoY2xpbmljaWFucyByZWFkIFx1NTU0Nlx1NTRDMVx1NTQwRCBmaXJzdCkuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBub3JtYWxpemVJY2QxMENtIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gaXNDamsoY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTRFMDAgKFUrNEUwMCkgdG8gXHU5RkZGIChVKzlGRkYpIGNvdmVycyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzLlxuICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gIHJldHVybiBjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmO1xufVxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIGlmIChpc0NqayhjaCkpIG4rKztcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogTWF0Y2ggYSBcImxvbmdcIiBFbmdsaXNoIGNodW5rIChcdTIyNjU0IGNoYXJzIG9mIEEtWi8wLTkvcHVuY3R1YXRpb24gY29tbW9uXG4gKiB0byBkcnVnIG5hbWVzKS4gQXZvaWQgbWF0Y2hpbmcgc2hvcnQgdG9rZW5zIGxpa2UgXCJEXCIgb3IgXCJQT1wiIHRoYXRcbiAqIGFwcGVhciBpbnNpZGUgQ2hpbmVzZSBuYW1lcy5cbiAqL1xuY29uc3QgRU5fQ0hVTktfRyA9IC9bQS1aXVtBLVowLTkuJS9cXC1cIidcXHNdezMsfS9nO1xuXG4vKipcbiAqIFJlZHVjZSBhIGRydWctbmFtZSBzdHJpbmcgdG8gYSBzdGFibGUgY2Fub25pY2FsIGtleS4gRXh0cmFjdCB0aGVcbiAqIGxvbmdlc3QgRW5nbGlzaCBmcmFnbWVudCwgdGhlbiB0cnVuY2F0ZSBhdCBjb21tb24gc2VwYXJhdG9ycyBzbyBhXG4gKiBuYW1lIHdpdGggZXh0cmEgdHJhaWxpbmcgbW9kaWZpZXJzIHN0aWxsIGNvbGxhcHNlcyB0byBicmFuZCtzdHJlbmd0aC5cbiAqXG4gKiBFeGFtcGxlcyAoYWxsIG1hcCB0byBcInRpbW9wdG9sIHhlIDAuNSUgb3BodGhhbG1pYyBzb2x1dGlvblwiKTpcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT05cIlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTiAoXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2KVwiXG4gKiAgIFwiXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2IChUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04pXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbERydWdLZXkobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAobmFtZSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjaHVua3MgPSBbLi4ucy5tYXRjaEFsbChFTl9DSFVOS19HKV0ubWFwKChtKSA9PiBtWzBdKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKG5hbWUgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IGxvbmdlc3QgPSBjaHVua3MucmVkdWNlKChhLCBiKSA9PiAoYi5sZW5ndGggPiBhLmxlbmd0aCA/IGIgOiBhKSkudHJpbSgpO1xuICBmb3IgKGNvbnN0IHNlcCBvZiBbXCIgLSBcIiwgXCIgXHUyMDEzIFwiLCBcIiAvIFwiXSkge1xuICAgIGlmIChsb25nZXN0LmluY2x1ZGVzKHNlcCkpIHtcbiAgICAgIGxvbmdlc3QgPSBsb25nZXN0LnNwbGl0KHNlcClbMF0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9uZ2VzdC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBCZXN0LWVmZm9ydCBhY3RpdmUgdnMgY29tcGxldGVkIGRlY2lzaW9uIGZvciBhIE1lZGljYXRpb25SZXF1ZXN0LlxuICogQWN0aXZlIHdoaWxlIChhdXRob3JlZF9kYXRlICsgZHVyYXRpb24gPiB0b2RheSk7IG90aGVyd2lzZSBjb21wbGV0ZWQuXG4gKiBNaXNzaW5nIGR1cmF0aW9uIFx1MjE5MiBhc3N1bWUgOTAtZGF5IHJlZmlsbCB3aW5kb3cgKE5ISSdzIHR5cGljYWwgY2FkZW5jZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRTdGF0dXMoXG4gIGF1dGhvcmVkSXNvOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkdXJhdGlvbkRheXM6IGFueSxcbik6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHtcbiAgaWYgKCFhdXRob3JlZElzbykgcmV0dXJuIFwiY29tcGxldGVkXCI7XG4gIGNvbnN0IGRhdGVQYXJ0ID0gU3RyaW5nKGF1dGhvcmVkSXNvKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IHBhcnNlZCA9IG5ldyBEYXRlKGAke2RhdGVQYXJ0fVQwMDowMDowMFpgKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiY29tcGxldGVkXCI7XG5cbiAgbGV0IGRheXM6IG51bWJlciB8IG51bGw7XG4gIGlmIChkdXJhdGlvbkRheXMgPT09IG51bGwgfHwgZHVyYXRpb25EYXlzID09PSB1bmRlZmluZWQgfHwgZHVyYXRpb25EYXlzID09PSBcIlwiKSB7XG4gICAgZGF5cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbiA9IE51bWJlci5wYXJzZUludChTdHJpbmcoZHVyYXRpb25EYXlzKSwgMTApO1xuICAgIGRheXMgPSBOdW1iZXIuaXNGaW5pdGUobikgPyBuIDogbnVsbDtcbiAgfVxuICBpZiAoZGF5cyA9PT0gbnVsbCkgZGF5cyA9IDkwO1xuXG4gIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHBhcnNlZC5nZXRUaW1lKCkpO1xuICBlbmQuc2V0VVRDRGF0ZShlbmQuZ2V0VVRDRGF0ZSgpICsgZGF5cyk7XG4gIC8vIENvbXBhcmUgZGF0ZS1vbmx5ICh0b2RheSBpbiBVVEMgc2luY2Ugd2UgYXV0aG9yZWRJc28gaXMgZGF0ZS1vbmx5KS5cbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICB0b2RheS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGVuZCA+PSB0b2RheSA/IFwiYWN0aXZlXCIgOiBcImNvbXBsZXRlZFwiO1xufVxuXG4vKipcbiAqIENvbnZlcnQgb25lIHNjcmFwZWQgcHJlc2NyaXB0aW9uIGRpY3QgXHUyMTkyIEZISVIgUjQgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiByYXcgaGFzIG5vIGBkcnVnX25hbWVgIChjYWxsZXIgZmlsdGVycyBvdXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvblJlcXVlc3QoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRydWdOYW1lID0gKChyYXcuZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWRydWdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAvLyBDYW5vbmljYWwga2V5IChub3QgcmF3IGRydWdfbmFtZSkgZm9yIHN0YWJsZSBpZCBzbyB0aGUgdGhyZWUgTkhJXG4gIC8vIFx1NEUyRFx1ODJGMSB2YXJpYW50cyBvZiB0aGUgc2FtZSBkcnVnIGNvbGxhcHNlIHRvIG9uZSBGSElSIHJlc291cmNlLlxuICBjb25zdCBtZWRJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSksIHJhdy5kYXRlID8/IFwiXCIpO1xuXG4gIGNvbnN0IGRydWdDb2RlID0gKChyYXcuY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHN5c3RlbTogZHJ1Z0NvZGUgPyBzeXN0ZW1zLk5ISV9EUlVHX0NPREUgOiBzeXN0ZW1zLkhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUsXG4gICAgY29kZTogZHJ1Z0NvZGUgfHwgZHJ1Z05hbWUsXG4gICAgZGlzcGxheTogZHJ1Z05hbWUsXG4gIH07XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChkcnVnQ2xhc3MpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IHRleHQ6IGRydWdDbGFzcyB9XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIFwiMTIwNTJCXCI6IFwiMTA4NzMtOFwiLCAvLyBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIwMjhCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1NUFFXHU1NDExXHU1MTREXHU3NUFCXHU2NEY0XHU2NTYzXG4gIFwiMTIwMjlCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1XG4gIFwiMTIxMDNCXCI6IFwiOTU4MDEtN1wiLCAvLyBcdTUxNERcdTc1QUJcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjE2MEJcIjogXCIxNTE4OS00XCIsIC8vIElnRyBcdTAzQkEvXHUwM0JCXG4gIFwiMTIxNzFCXCI6IFwiMTczNTEtOFwiLCAvLyBcdTYyOTdcdTU1RENcdTRFMkRcdTYwMjdcdTc0MDNcdTdEMzBcdTgwREVcdThDRUFcdTYyOTdcdTlBRDQgKEFOQ0EpXG4gIFwiMTIyMDRCXCI6IFwiMjA1ODQtOVwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTg4NjhcdTk3NjJcdTZBMTlcdThBMThcbiAgXCIyNTAxM0JcIjogXCI0NDU5Ni01XCIsIC8vIFx1ODdBMlx1NTE0OVx1NTIwN1x1NzI0N1x1NkFBMlx1NjdFNVxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDMwQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMxQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMyQ1wiOiBcIjUxOTYtMVwiLCAvLyBIQnNBZyAoTWFzcy92b2wpXG4gIFwiMTQwNTFDXCI6IFwiMTM5NTUtMFwiLCAvLyBIQ1YgQWJcbiAgXCIyNzAzM0NcIjogXCI1MTk3LTlcIiwgLy8gSEJzQWcgUklBXG4gIC8vIFx1MjUwMFx1MjUwMCBQYXRob2xvZ3kgLyBjeXRvbG9neSAvIElIQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjE5NUJcIjogXCIxODQ3NC03XCIsIC8vIEhlci0yL25ldSBJU0hcbiAgXCIyNzA2MUJcIjogXCIxNDEzMC05XCIsIC8vIFx1NTJENVx1NjBDNVx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoRVIpXG4gIFwiMjcwNjJCXCI6IFwiMTA4NjEtM1wiLCAvLyBcdTlFQzNcdTlBRDRcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKFBSKVxuICBcIjMwMTAzQlwiOiBcIjgzMDUyLTFcIiwgLy8gUEQtTDEgSUhDXG4gIC8vIFx1MjUwMFx1MjUwMCBBdWRpb2xvZ3kgLyBwdWxtb25hcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTcwMDlCXCI6IFwiMjQzNDEtMFwiLCAvLyBcdTRFMDBcdTZDMjdcdTUzMTZcdTc4QjNcdTgwQkFcdTcwMzBcdTY1NjNcdTkxQ0ZcbiAgXCIyMjAwMUNcIjogXCI0NTQ5OC0zXCIsIC8vIFx1N0QxNFx1OTdGM1x1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDE1QlwiOiBcIjQ1NDk4LTNcIiwgLy8gXHU4QTUwXHU4MDdFXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMjVCXCI6IFwiNDY1MzAtMlwiLCAvLyBcdTgxRUFcdThBMThcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFNVUFBMRU1FTlRBTCAobm90IGluIFBBUyBDb25jZXB0TWFwIFx1MjAxNCBoYW5kLWN1cmF0ZWQgZnJvbSBjb21tb25cbiAgLy8gTkhJIGNvZGVzIHNlZW4gaW4gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBLiBMT0lOQyB2ZXJpZmllZCBhZ2FpbnN0IGxvaW5jLm9yZ1xuICAvLyBjYW5vbmljYWwgbmFtZXMuIE1ldGhvZC1zcGVjaWZpYyBjb2RlcyAoZS5nLiBocy1DUlApIHBpY2sgdGhlXG4gIC8vIHNwZWNpZmljIExPSU5DOyBnZW5lcmFsLW1ldGhvZCBjb2RlcyBwaWNrIHRoZSBtb3N0IGNvbW1vbiBmb3JtLlxuICAvLyBJZiBcdTUwNjVcdTRGRERcdTdGNzIgcHVibGlzaGVzIGFuIGF1dGhvcml0YXRpdmUgYnJvYWRlciBDb25jZXB0TWFwIGxhdGVyLFxuICAvLyByZXBsYWNlIHRoaXMgc2VjdGlvbiBpbiBvbmUgcGFzcy5cbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIC8gSGJBMWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDVDXCI6IFwiMTU1OC02XCIsIC8vIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENiAoR2x1LUFDKSBcdTIwMTQgRmFzdGluZyBnbHVjb3NlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTQwQ1wiOiBcIjIzNDUtN1wiLCAvLyBcdTg4NDBcdTdDRDYtXHU5OTEwXHU1RjhDL1x1OTZBOFx1NkE1RiBcdTIwMTQgR2x1Y29zZSBNYXNzL3ZvbCBTL1AgKGdlbmVyYWwpXG4gIFwiMDkwMDZDXCI6IFwiNDU0OC00XCIsIC8vIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMCAoSGJBMWMpIFx1MjAxNCBIZW1vZ2xvYmluIEExYy9IZ2IudG90YWwgQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFJlbmFsIC8gZWxlY3Ryb2x5dGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAyQ1wiOiBcIjMwOTQtMFwiLCAvLyBCVU4gXHUyMDE0IFVyZWEgbml0cm9nZW4gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTNDXCI6IFwiMzA4NC0xXCIsIC8vIFVyaWMgQWNpZCBcdTIwMTQgVXJhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMjFDXCI6IFwiMjk1MS0yXCIsIC8vIE5hIFx1MjAxNCBTb2RpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDIyQ1wiOiBcIjI4MjMtM1wiLCAvLyBLICBcdTIwMTQgUG90YXNzaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyNENcIjogXCIyMDI4LTlcIiwgLy8gQ08yIFx1MjAxNCBDYXJib24gZGlveGlkZSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMTJDXCI6IFwiMjc3Ny0xXCIsIC8vIElub3JnYW5pYyBQIFx1MjAxNCBQaG9zcGhhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDZCXCI6IFwiMTkxMjMtOVwiLCAvLyBNZyBcdTIwMTQgTWFnbmVzaXVtIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDFDXCI6IFwiMjA5My0zXCIsIC8vIFQtQ2hvbGVzdGVyb2wgXHUyMDE0IENob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDA0Q1wiOiBcIjI1NzEtOFwiLCAvLyBURyBcdTIwMTQgVHJpZ2x5Y2VyaWRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQzQ1wiOiBcIjIwODUtOVwiLCAvLyBIREwgXHUyMDE0IEhETCBjaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NENcIjogXCIxMzQ1Ny03XCIsIC8vIExETCBcdTIwMTQgTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpdmVyIGZ1bmN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDI3Q1wiOiBcIjY3NjgtNlwiLCAvLyBBTEstUCBcdTIwMTQgQWxrYWxpbmUgcGhvc3BoYXRhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzFDXCI6IFwiMjMyNC0yXCIsIC8vIFx1MDNCMy1HVCBcdTIwMTQgR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzVDXCI6IFwiMjUwMC03XCIsIC8vIFRJQkMgXHUyMDE0IElyb24gYmluZGluZyBjYXBhY2l0eSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzN0NcIjogXCIxODI3LTVcIiwgLy8gQW1tb25pYSBcdTIwMTQgUGxhc21hXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTA2Q1wiOiBcIjMwMjQtN1wiLCAvLyBGcmVlIFQ0IFx1MjAxNCBUaHlyb3hpbmUgZnJlZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgLy8gVFNIIFx1MjAxNCBUaHlyb3Ryb3BpbiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA5OUNcIjogXCIxMDgzOS05XCIsIC8vIFRyb3BvbmluIEkgXHUyMDE0IFRyb3BvbmluIEkgY2FyZGlhYyBTL1BcbiAgXCIxMjE5MkNcIjogXCIzMzk1OS04XCIsIC8vIFByb2NhbGNpdG9uaW4gXHUyMDE0IFMvUFxuICBcIjEyMTkzQ1wiOiBcIjMzNzYyLTZcIiwgLy8gTlQtcHJvQk5QIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFtaW5zIC8gY29mYWN0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTI5Q1wiOiBcIjIxMzItOVwiLCAvLyBWaXQgQjEyIFx1MjAxNCBDb2JhbGFtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzBDXCI6IFwiMjI4NC04XCIsIC8vIEZvbGF0ZSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTNDXCI6IFwiMjE0My02XCIsIC8vIENvcnRpc29sIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjExNkNcIjogXCIyMjc2LTRcIiwgLy8gRmVycml0aW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQWN1dGUgcGhhc2UgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEyMDE1QyBpcyB0aGUgZ2VuZXJpYyBOSEkgQ1JQIG9yZGVyIFx1MjAxNCBtb3N0IGNsaW5pY2FsIGNvbnRleHRzIGluIFx1NTA2NVx1NEZERFxuICAvLyBzZW5kIGEgcmVndWxhciAobm90IGhzLSkgQ1JQLCBzbyBtYXAgdG8gMTk4OC01LiBJZiBhIFx1OTY2Mlx1NjI0MCBzcGVjaWZpY2FsbHlcbiAgLy8gYmlsbHMgaHMtQ1JQIGl0IHdpbGwgbGFuZCBvbiBhIGRpZmZlcmVudCBjb2RlIChlLmcuIDEyMTg5QykuXG4gIFwiMTIwMTVDXCI6IFwiMTk4OC01XCIsIC8vIENSUCBcdTIwMTQgQyByZWFjdGl2ZSBwcm90ZWluIE1hc3Mvdm9sIFMvUFxuICBcIjEyMDUzQ1wiOiBcIjUwNDgtNFwiLCAvLyBBTkEgXHUyMDE0IEFudGludWNsZWFyIEFiIFRpdGVyIFMvUFxuICBcIjEyMDU2QlwiOiBcIjE2MTI0LTBcIiwgLy8gQW50aS1taXRvY2hvbmRyaWFsIEFiIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwNjAxMkNcIjogXCI1Nzc4LTZcIiwgLy8gVXJpbmUgYXBwZWFyYW5jZSBcdTIwMTQgQ29sb3JcbiAgXCIwNjAxM0NcIjogXCIyNDM1Ni04XCIsIC8vIFx1NUMzRlx1NzUxRlx1NTMxNiBwYW5lbCBcdTIwMTQgVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA3MDAxQ1wiOiBcIjE0NTYzLTFcIiwgLy8gU3Rvb2wgb2NjdWx0IGJsb29kXG4gIFwiMDkxMzRDXCI6IFwiNTg0NTMtMlwiLCAvLyBpRk9CVCBxdWFudGl0YXRpdmUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgU3Rvb2wgYnkgSUFcbiAgXCIxMjExMUNcIjogXCIyMTYxLThcIiwgLy8gVXJpbmUgQ3JlYXRpbmluZSBcdTIwMTQgc2FtZSBMT0lOQyBhcyAwOTAxNkNcbiAgLy8gXHUyNTAwXHUyNTAwIFNlcm9sb2d5IC8gaW1tdW5vbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwMUNcIjogXCI1MjkyLThcIiwgLy8gUlBSIFx1MjAxNCBTZXJ1bS9QbGFzbWFcbiAgXCIxMjAyMUNcIjogXCIyMDM5LTZcIiwgLy8gQ0VBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyNUJcIjogXCIyNDY1LTNcIiwgLy8gSWdHIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyN0JcIjogXCIyNDU4LThcIiwgLy8gSWdBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAzMUNcIjogXCIxOTExMy0wXCIsIC8vIElnRSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNjlCXCI6IFwiNTEzMi02XCIsIC8vIENyeXB0b2NvY2N1cyBBZyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNzlDXCI6IFwiMjQxMDgtM1wiLCAvLyBDQSAxOS05IFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEJsb29kIHR5cGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTEwMDFDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDAzQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwNENcIjogXCI4OTAtNFwiLCAvLyBcdTYyOTdcdTlBRDRcdTUzQ0RcdTYxQzkgXHUyMDE0IEFudGlib2R5IHNjcmVlblxuICAvLyBcdTI1MDBcdTI1MDAgTWljcm9iaW9sb2d5IGN1bHR1cmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMzAwN0MgXHU3RDMwXHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxNDIxOS0wIHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdIVExWIEkgcDI2IEFiIGluIFNlcnVtJyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gVGhlXG4gIC8vIHJpZ2h0IGZhbWlseSBpcyA2NDYzLTQgLyAxMTI2OC0wIChCYWN0ZXJpYSBpZGVudGlmaWVkIGJ5IGFlcm9iZVxuICAvLyBjdWx0dXJlKSBidXQgdGhlIHNvdXJjZSByb3cgZG9lc24ndCB0ZWxsIHVzIHNwZWNpbWVuIFx1MjAxNCBsZWF2aW5nXG4gIC8vIHVubWFwcGVkIHNvIHdlIGRvbid0IGxpZS4gRmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgXCIxMzAxM0NcIjogXCIzMTk1Mi01XCIsIC8vIFRCIEN1bHR1cmUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gdHViZXJjdWxvc2lzIGN1bHR1cmVcbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAwNEJcIjogXCI3ODQ5LTNcIiwgLy8gQ01WIElnRyBcdTIwMTQgQWIgUy9QXG4gIFwiMTQwNDhCXCI6IFwiNzg1MC0xXCIsIC8vIENNViBJZ00gXHUyMDE0IEFiIFMvUFxuICBcIjE0MDY2Q1wiOiBcIjgwMzgzLTNcIiwgLy8gSW5mbHVlbnphIEEgXHUyMDE0IEFnIFJlc3BpcmF0b3J5XG4gIFwiMTQwODRDXCI6IFwiOTQ1NTgtNFwiLCAvLyBTQVJTLUNvVi0yIEFnIFx1MjAxNCBSZXNwaXJhdG9yeVxuICBcIjEyMTg0Q1wiOiBcIjg4MTU3LTNcIiwgLy8gQ01WIEROQSBxdWFudCBQQ1IgXHUyMDE0IFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgTXljb2JhY3Rlcml1bSAvIGFjaWQtZmFzdCAoYWRkZWQgYWZ0ZXIgYXVkaXQpIFx1MjUwMFxuICBcIjEzMDI1Q1wiOiBcIjI5MjYwLTdcIiwgLy8gXHU2Mjk3XHU5MTc4XHU2MDI3XHU2RkMzXHU3RTJFXHU2MkI5XHU3MjQ3XHU2N0QzXHU4MjcyXHU2QUEyXHU2N0U1IFx1MjAxNCBNeWNvYmFjdGVyaXVtIEFGQiBzdGFpblxuICBcIjEzMDI2Q1wiOiBcIjI5NTUzLTVcIiwgLy8gXHU2Mjk3XHU5MTc4XHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBNeWNvYmFjdGVyaXVtIGN1bHR1cmUgbGlxdWlkK3NvbGlkXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgcGFuZWwgKDA5MDQxQikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEludGVudGlvbmFsbHkgTk9UIG1hcHBlZCBoZXJlIFx1MjAxNCAwOTA0MUIgaXMgYSBwYW5lbCBvcmRlciB0aGF0XG4gIC8vIHVuZm9sZHMgaW50byBtYW55IGl0ZW1zIChwSCAvIHBDTzIgLyBwTzIgLyBIQ08zIC8gVENPMiAvIFNCRSAvXG4gIC8vIEFCRSAvIFNCQyAvIFNBVCkuIE1hcHBpbmcgdGhlIHBhbmVsIGNvZGUgdG8gXCJwSFwiIHdvdWxkIG1pcy1sYWJlbFxuICAvLyBldmVyeSBub24tcEggcm93IHRoYXQgc2hhcmVzIHRoaXMgTkhJIGNvZGUuIEVhY2ggaXRlbSBpc1xuICAvLyByZXNvbHZlZCB2aWEgX0xPSU5DX01BUCBkaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgYmVsb3c7IDA5MDQxQlxuICAvLyBhbHNvIGFwcGVhcnMgaW4gX0RJU1BMQVlfRklSU1RfQ09ERVMgc28gZGlzcGxheSBhbHdheXMgd2lucy5cbiAgLy8gXHUyNTAwXHUyNTAwIEJvZHkgZmx1aWQgLyBzeW5vdmlhbCBmbHVpZCBwYW5lbCAoMTYwMDhDIHVuZm9sZHM7IHRoZVxuICAvLyBtZW1iZXIgaXRlbXMgcmVseSBvbiBkaXNwbGF5IGtleXdvcmRzIGZvciBzcGVjaW1lbi1hd2FyZVxuICAvLyBMT0lOQ3MpLiBQYXJlbnQgY29kZSBtYXBzIHRvIHN5bm92aWFsIGZsdWlkIGFuYWx5c2lzIHBhbmVsLiBcdTI1MDBcdTI1MDBcbiAgLy8gMTYwMDhDIFx1NkVEMVx1NkRCMlx1NkFBMlx1NjdFNSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzM5MDMtNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnS2V0b25lcyBbUHJlc2VuY2VdIGluIFVyaW5lJyAodmVyaWZpZWQgbG9pbmMub3JnKS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgdGhlIHBhbmVsIGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGluZyBvbmx5XG4gIC8vIGFuZCB0aGUgcGVyLWl0ZW0gZGlzcGxheXMgaW4gX0xPSU5DX01BUCBjYXJyeSB0aGVpciBvd24gTE9JTkNzXG4gIC8vIHdoZXJlIGtub3duLlxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9ESVNQTEFZX0ZJUlNUX0NPREVTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIGNvZGVzIHRoYXQgYXJlICpwYW5lbHMqIFx1MjAxNCBvbmUgYmlsbGluZyBjb2RlLCBtYW55IGl0ZW0tc3BlY2lmaWNcbi8vIGRpc3BsYXlzLiBGb3IgdGhlc2UsIGRpc3BsYXkga2V5d29yZCBNVVNUIGJlIHRyaWVkIGZpcnN0IChzbyBcIldCQ1wiXG4vLyB1bmRlciBDQkMgcGFuZWwgMDgwMTFDIGdldHMgNjY5MC0yLCBub3QgdGhlIGdlbmVyaWMgcGFuZWwgTE9JTkMpLlxuLy8gRm9yIGV2ZXJ5dGhpbmcgZWxzZSAoc2luZ2xlLXRlc3QgY29kZXMgbGlrZSAwOTAwNUMgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2LFxuLy8gMDkwNDRDIExETCwgMTQwMzBDIEhCc0FnKSwgdGhlIE5ISSBjb2RlIGlzIG1vcmUgc3BlY2lmaWMgdGhhbiBhbnlcbi8vIGRpc3BsYXkga2V5d29yZCBhbmQgd2lucyBvdXRyaWdodC5cbi8vXG4vLyBERVNJR04gUEhJTE9TT1BIWTogdGhlIGJyaWRnZSBpcyBhICpmYWl0aGZ1bCB0cmFuc3BvcnQqIGxheWVyIFx1MjAxNCBpdFxuLy8gdHJ1c3RzIHRoZSBcdTUwNjVcdTRGREQgYmlsbGluZyBjb2RlIGFzIGF1dGhvcml0YXRpdmUgZm9yIGNsaW5pY2FsIGludGVudFxuLy8gKFx1OTY2Mlx1NjI0MCBiaWxsZWQgMDkwMDVDID0gdGhleSBvcmRlcmVkIGZhc3RpbmcgZ2x1Y29zZSwgcmVnYXJkbGVzcyBvZlxuLy8gd2hldGhlciB0aGUgb3BlcmF0aW9uYWwgc3BlY2ltZW4gd2FzIGEgZmluZ2VyLXN0aWNrKS4gRGlzcGxheS1zdHJpbmdcbi8vIHJlLWludGVycHJldGF0aW9uIG9mIGNsaW5pY2FsIGNvbnRleHQgKEdsdS1BQyB2cyBGSU5HRVIgU1VHQVIgdnNcbi8vIHJhbmRvbSkgaXMgbGVmdCB0byB0aGUgU01BUlQgYXBwLCB3aGljaCBoYXMgbW9yZSBVSSBjb250ZXh0LlxuZXhwb3J0IGNvbnN0IERJU1BMQVlfRklSU1RfQ09ERVM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgXCIwODAxMUNcIiwgLy8gQ0JDIHBhbmVsXG4gIFwiMDgwMTNDXCIsIC8vIENCQyB3LyBhdXRvIGRpZmYgcGFuZWxcbiAgXCIwNjAxM0NcIiwgLy8gVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA5MDQxQlwiLCAvLyBBQkcgcGFuZWxcbiAgXCIxNjAwOENcIiwgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIHBhbmVsXG5dKTtcblxuLy8gXHUyNTAwXHUyNTAwIF9QQU5FTF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQYW5lbC1zcGVjaWZpYyBkaXNwbGF5IFx1MjE5MiBMT0lOQyBvdmVycmlkZXMuIFRoZXNlIHJ1biBCRUZPUkUgdGhlIGdsb2JhbFxuLy8gX0xPSU5DX01BUCBzbyB0aGF0IHVyaW5lIGJpbGlydWJpbiB1bmRlciAwNjAxM0MgbWFwcyB0byA1NzcwLTMgKHVyaW5lXG4vLyBzcGVjaW1lbikgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgZ2xvYmFsICdiaWxpcnViaW4nIHRoYXRcbi8vIHdvdWxkIGltcGx5IHNlcnVtLCBhbmQgYW5hbG9nb3VzIHNwZWNpbWVuLWF3YXJlIGRpc2FtYmlndWF0aW9uIGZvclxuLy8gb3RoZXIgcGFuZWwgc3ViLWl0ZW1zLiBLZXlzIGFyZSBOSEkgcGFuZWwgY29kZXMgKG11c3QgYWxzbyBiZSBpblxuLy8gX0RJU1BMQVlfRklSU1RfQ09ERVMpOyB2YWx1ZXMgYXJlIGRpc3BsYXkta2V5d29yZCBcdTIxOTIgTE9JTkMgZGljdHMgdGhhdFxuLy8gZm9sbG93IHRoZSBzYW1lIG1hdGNoaW5nIHNlbWFudGljcyBhcyBfTE9JTkNfTUFQIChsZWFkaW5nIHdvcmRcbi8vIGJvdW5kYXJ5IGZvciBBU0NJSSwgc3Vic3RyaW5nIGZvciBDSkspLlxuZXhwb3J0IGNvbnN0IFBBTkVMX0xPSU5DX01BUDogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBBbGwgcm91dGluZSBkaXBzdGljayBpdGVtcyByZXNpZGUgb24gYSBzaW5nbGUgTkhJIGJpbGxpbmcgY29kZS5cbiAgLy8gV2l0aG91dCB0aGlzIHRhYmxlIHRoZXknZCBhbGwgY29sbGFwc2UgdG8gdGhlIHBhbmVsIExPSU5DIDI0MzU2LTgsXG4gIC8vIGxvc2luZyBwZXItaXRlbSBncmFudWxhcml0eSB0aGF0J3MgY2xpbmljYWxseSB1c2VmdWwgKGUuZy5cbiAgLy8gYmlsaXJ1YmluIHZzIHVyb2JpbGlub2dlbiBmb3IgbGl2ZXIgd29ya3VwKS5cbiAgXCIwNjAxM0NcIjoge1xuICAgIC8vIE9yZGVyIG1hdHRlcnM6IGxvbmdlci9tb3JlLXNwZWNpZmljIGtleXMgYmVmb3JlIGdlbmVyaWMgb25lc1xuICAgIC8vIChtYXRjaGVzIF9MT0lOQ19NQVAgaXRlcmF0aW9uIHNlbWFudGljcyBcdTIwMTQgZmlyc3QgaGl0IHdpbnMpLlxuICAgIFwic3BlY2lmaWMgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLCAvLyBTcGVjaWZpYyBncmF2aXR5IFVyaW5lXG4gICAgXCJzcC5ncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXCJzcCBncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXHU2QkQ0XHU5MUNEOiBcIjU4MTEtNVwiLFxuICAgIFwibWljcm8tYWxidW1pblwiOiBcIjE0OTU3LTVcIiwgLy8gTWljcm9hbGJ1bWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgbWljcm9hbGJ1bWluOiBcIjE0OTU3LTVcIixcbiAgICBcIm1hbGIodSlcIjogXCIxNDk1Ny01XCIsXG4gICAgbWFsYjogXCIxNDk1Ny01XCIsXG4gICAgXHU1RkFFXHU1QzBGXHU3NjdEXHU4NkNCXHU3NjdEOiBcIjE0OTU3LTVcIixcbiAgICB1YWNyOiBcIjE0OTU5LTFcIiwgLy8gTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgcmF0aW8gVXJpbmVcbiAgICBcInVyaW5lIGdsdWNvc2VcIjogXCI1NzkyLTdcIixcbiAgICBzdWdhcjogXCI1NzkyLTdcIiwgLy8gTkhJICdcdTVDM0ZcdTdDRDYnIC8gJ1N1Z2FyJyB1bmRlciAwNjAxM0NcbiAgICBcdTVDM0ZcdTdDRDY6IFwiNTc5Mi03XCIsXG4gICAgdXJvYmlsaW5vZ2VuOiBcIjU4MTgtMFwiLCAvLyBVcm9iaWxpbm9nZW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMjBcdTUzOUY6IFwiNTgxOC0wXCIsXG4gICAgYmlsaXJ1YmluOiBcIjU3NzAtM1wiLCAvLyBCaWxpcnViaW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMDVcdTdEMjA6IFwiNTc3MC0zXCIsXG4gICAgbml0cml0ZTogXCI1ODAyLTRcIiwgLy8gTml0cml0ZSBVcmluZVxuICAgIFx1NEU5RVx1Nzg1RFx1OTE3ODogXCI1ODAyLTRcIixcbiAgICBrZXRvbmVzOiBcIjU3OTctNlwiLCAvLyBLZXRvbmVzIFVyaW5lXG4gICAga2V0b25lOiBcIjU3OTctNlwiLFxuICAgIFx1OTE2RVx1OUFENDogXCI1Nzk3LTZcIixcbiAgICBwcm90ZWluOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICAgIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBsZXVrb2N5dGU6IFwiNTc5OS0yXCIsIC8vIExldWtvY3l0ZXMgVXJpbmVcbiAgICBsZXU6IFwiNTc5OS0yXCIsXG4gICAgXHU3NjdEXHU4ODQwXHU3NDAzXHU5MTZGXHU5MTc2OiBcIjU3OTktMlwiLFxuICAgIGJsb29kOiBcIjU3OTQtM1wiLCAvLyBIZW1vZ2xvYmluIFVyaW5lIFFsXG4gICAgXHU2RjVCXHU4ODQwOiBcIjU3OTQtM1wiLFxuICAgIFx1ODI3MjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgVXJpbmUgKENKSyBzdWJzdHJpbmcpXG4gICAgY29sb3I6IFwiNTc3OC02XCIsXG4gICAgdHVyYmlkaXR5OiBcIjU3NjctOVwiLCAvLyBBcHBlYXJhbmNlIG9mIFVyaW5lXG4gICAgYXBwZWFyYW5jZTogXCI1NzY3LTlcIixcbiAgICBcdTU5MTZcdTg5QzA6IFwiNTc2Ny05XCIsXG4gICAgcGg6IFwiNTgwMy0yXCIsIC8vIHBIIG9mIFVyaW5lICh1cmluZS1zcGVjaWZpYywgTk9UXG4gICAgLy8gdGhlIGFydGVyaWFsIDExNTU4LTQgdGhhdCB0aGVcbiAgICAvLyBnbG9iYWwgbWFwIHBvaW50cyB0bylcbiAgICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiNTgwMy0yXCIsXG4gICAgZ2x1Y29zZTogXCI1NzkyLTdcIiwgLy8gTGFzdCBpbiB0aGlzIGJsb2NrIHNvICd1cmluZVxuICB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDb21tb24gVGFpd2FuZXNlIEhJUyBsYWIgbmFtZXMgXHUyMTkyIExPSU5DIGNvZGUgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IExPSU5DX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIERpc3BsYXkta2V5d29yZCBmYWxsYmFjayBvbmx5IGtpY2tzIGluIHdoZW4gTk8gTkhJIGNvZGUgaXNcbiAgLy8gcHJlc2VudCAoZGFzaGJvYXJkIHJvd3MsIExMTS1leHRyYWN0ZWQgdGV4dCkuIFdoZW4gdGhlIE5ISSBjb2RlXG4gIC8vIElTIHByZXNlbnQsIDA5MDA1QyBcdTIxOTIgMTU1OC02IChGYXN0aW5nKSBhbmQgMDkxNDBDIFx1MjE5MiAyMzQ1LTdcbiAgLy8gKGdlbmVyaWMpIHdpbnMgZGlyZWN0bHkgdmlhIF9OSElfVE9fTE9JTkMuXG4gIC8vXG4gIC8vIEZhaXRoZnVsLXRyYW5zcG9ydCBwcmluY2lwbGU6IHRoZSBicmlkZ2UgZG9lcyBOT1QgcmUtaW50ZXJwcmV0XG4gIC8vIGRpc3BsYXkgc3RyaW5ncyBsaWtlIFwiRklOR0VSIFNVR0FSXCIgYXMgYSBkaWZmZXJlbnQgTE9JTkMgXHUyMDE0IGl0XG4gIC8vIHByZXNlcnZlcyB0aGUgcmF3IGRpc3BsYXkgaW4gYGNvZGUudGV4dGAgYW5kIHRoZSBvcmlnaW5hbCBOSElcbiAgLy8gY29kZSBpbiBgY29kZS5jb2RpbmdgLiBUaGUgU01BUlQgYXBwIGRvZXMgc3BlY2ltZW4vbWV0aG9kLWF3YXJlXG4gIC8vIGdyb3VwaW5nIG9uIHRoZSBjb25zdW1lciBzaWRlIChzZWUgU01BUlQgYXBwIGhhbmRvZmYgZG9jKS5cbiAgXCJmYXN0aW5nIGdsdWNvc2VcIjogXCIxNTU4LTZcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIjE1NTgtNlwiLFxuICBcImdsdS1hY1wiOiBcIjE1NTgtNlwiLFxuICBcImdsdWNvc2UgYWNcIjogXCIxNTU4LTZcIixcbiAgZ2x1Y29zZTogXCIyMzQ1LTdcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIjIzNDUtN1wiLFxuICBnbHU6IFwiMjM0NS03XCIsXG4gIC8vIEhiQTFjIE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljIFwiaGJcIiBlbnRyaWVzIHNvIHRoZSBsb25nZXN0LXByZWZpeFxuICAvLyBtYXRjaCB3aW5zIGZvciB0aGUgXCJIYkExY1wiIGRpc3BsYXkgc3RyaW5nLiBPdGhlciBBMWMgc3lub255bXNcdTIwMjZcbiAgaGJhMWM6IFwiNDU0OC00XCIsXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCI0NTQ4LTRcIixcbiAgYTFjOiBcIjQ1NDgtNFwiLFxuICBoZW1vZ2xvYmluOiBcIjcxOC03XCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCI3MTgtN1wiLFxuICBoZ2I6IFwiNzE4LTdcIixcbiAgaGI6IFwiNzE4LTdcIixcbiAgLy8gQ0JDIGRpZmYgXHUyMDE0IGVvc2lub3BoaWwgY291bnQgbXVzdCBwcmVjZWRlIHRoZSBiYXJlICd3YmMnLydcdTc2N0RcdTg4NDBcdTc0MDMnXG4gIC8vIGtleXMgKHdoaWNoIHdvdWxkIG90aGVyd2lzZSB3aW4gYXMgc3Vic3RyaW5ncykuXG4gIC8vIDcxMS0yIHZlcmlmaWVkIGF0IGxvaW5jLm9yZzogJ0Vvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2RcbiAgLy8gYnkgQXV0b21hdGVkIGNvdW50Jy5cbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWxzOiBcIjcxMS0yXCIsXG4gIHdiYzogXCI2NjkwLTJcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIjY2OTAtMlwiLFxuICBwbGF0ZWxldDogXCI3NzctM1wiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiNzc3LTNcIixcbiAgcGx0OiBcIjc3Ny0zXCIsXG4gIC8vIFJCQyArIFJCQyBpbmRpY2VzIFx1MjAxNCB2ZXJpZmllZCBMT0lOQ3MgKGxvaW5jLm9yZyk6XG4gIC8vIDc4OS04ICBFcnl0aHJvY3l0ZXMgIy92b2wgQmxvb2QgQXV0byAgICAgICAgICAgICAgXHUyMTkyIFJCQ1xuICAvLyA3ODUtNiAgRXJ5dGhyb2N5dGUgbWVhbiBjb3JwdXNjdWxhciBoZW1vZ2xvYmluICAgIFx1MjE5MiBNQ0hcbiAgLy8gTG9uZyBDSksgZm9ybXMgZmlyc3QgKExETC9jaG9sZXN0ZXJvbCBwYXR0ZXJuKSBzbyAnXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXG4gIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMCcgd2lucyBvdmVyIFx1N0QwNVx1ODg0MFx1NzQwMy5cbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIjc4NS02XCIsXG4gIHJiYzogXCI3ODktOFwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiNzg5LThcIixcbiAgbWNoOiBcIjc4NS02XCIsXG4gIC8vIFVyaW5lIGNyZWF0aW5pbmUgXHUyMDE0IE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljICdjcmVhdGluaW5lJyBzb1xuICAvLyByb3dzIGxpa2UgJ1UtQ1JFIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MCcgb3IgJ0NyZWF0aW5pbmUoVSknIHJlc29sdmUgdG8gdGhlXG4gIC8vIHVyaW5lIExPSU5DICgyMTYxLTgpIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIHNlcnVtXG4gIC8vIGRlZmF1bHQgKDIxNjAtMCkuIFNhbWUgbG9uZ2VzdC1zcGVjaWZpYy1maXJzdCBvcmRlcmluZyBhc1xuICAvLyB0aGUgZmFzdGluZy12cy1yYW5kb20gZ2x1Y29zZSBibG9jay5cbiAgXCJ1cmluZSBjcmVhdGluaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSB1cmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUodSlcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlYVwiOiBcIjIxNjEtOFwiLFxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MS04XCIsXG4gIGNyZWF0aW5pbmU6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIjIxNjAtMFwiLCAvLyBUYWl3YW4gdmFyaWFudCBzcGVsbGluZ1xuICBjcmVhOiBcIjIxNjAtMFwiLFxuICBidW46IFwiMzA5NC0wXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCIzMDk0LTBcIixcbiAgYXN0OiBcIjE5MjAtOFwiLFxuICBhbHQ6IFwiMTc0Mi02XCIsXG4gIGZlcnJpdGluOiBcIjIyNzYtNFwiLFxuICBcdTg4NDBcdTZFMDVcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiMjI3Ni00XCIsXG4gIGZlcnI6IFwiMjI3Ni00XCIsXG4gIC8vIFZpdGFsLXNpZ25zIGZyb20gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IChJSEtFMzQwMikgXHUyMDE0IHNlcGFyYXRlIGNvZGUgbmFtZXNwYWNlXG4gIC8vIGJ1dCB0aGUgbG9va3VwIGlzIGJ5IGRpc3BsYXktbmFtZSBzdWJzdHJpbmcsIHNhbWUgYXMgZm9yIGxhYnMuXG4gIFwiYm9keSBoZWlnaHRcIjogXCI4MzAyLTJcIixcbiAgXCJib2R5IHdlaWdodFwiOiBcIjI5NDYzLTdcIixcbiAgYm1pOiBcIjM5MTU2LTVcIixcbiAgLy8gV2Fpc3QgY2lyY3VtZmVyZW5jZSBcdTIwMTQgbWVhc3VyZW1lbnQgTE9JTkMgKDgyODAtMCkuIDU2MDg2LTIgaXNcbiAgLy8gdGhlICdBZHVsdCBXYWlzdCBDaXJjdW1mZXJlbmNlIFByb3RvY29sJyBjb2RlLCB3aGljaCBpcyBhXG4gIC8vIHN1cnZleS9wcm90b2NvbCBkZXNjcmlwdG9yLCBOT1QgYSBudW1lcmljIG1lYXN1cmVtZW50XG4gIC8vICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBOSEkgXHU1MDY1XHU0RkREIHJlcG9ydHMgYSBzaW5nbGUgd2Fpc3RsaW5lXG4gIC8vIG51bWJlciBwZXIgdmlzaXQsIHNvIHRoZSBtZWFzdXJlbWVudCBjb2RlIGlzIGNvcnJlY3QuXG4gIFwid2Fpc3QgY2lyY3VtZmVyZW5jZVwiOiBcIjgyODAtMFwiLFxuICBcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ4MC02XCIsXG4gIFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ2Mi00XCIsXG4gIC8vIExpcGlkIHBhbmVsIFx1MjAxNCBPUkRFUiBNQVRURVJTLiBMREwvSERMIHZhcmlhbnRzIE1VU1QgcHJlY2VkZSB0aGVcbiAgLy8gZ2VuZXJpYyAnY2hvbGVzdGVyb2wnIGtleSBzbyBhIHJvdyBsYWJlbGxlZCAnTERMIENIT0xFU1RFUk9MJ1xuICAvLyByZXNvbHZlcyB0byAxMzQ1Ny03IChMREwgY2FsY3VsYXRlZCkgYW5kICdIREwgQ0hPTEVTVEVST0wnIHRvXG4gIC8vIDIwODUtOSwgaW5zdGVhZCBvZiBmYWxsaW5nIHRvIDIwOTMtMyAodG90YWwgY2hvbGVzdGVyb2wpIHZpYSB0aGVcbiAgLy8gJ2Nob2xlc3Rlcm9sJyBzdWJzdHJpbmcuIFNhbWUgY2Fub25pY2FsIG9yZGVyaW5nIGFzIF9MQUJfU1lOT05ZTVMuXG4gIFwibGRsIGNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcImxkbC1jaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgLy8gMTM0NTctNyA9IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgXHUyMDE0IG1hdGNoZXMgdGhlIE5ISSAwOTA0NENcbiAgLy8gYmlsbGluZyBjb2RlJ3MgaW50ZW50IChUYWl3YW4gbGFicyBwcmVkb21pbmFudGx5IHJlcG9ydCBjYWxjdWxhdGVkXG4gIC8vIExETCB2aWEgRnJpZWRld2FsZCkuIEtlZXAgY29uc2lzdGVudCB3aXRoIF9OSElfVE9fTE9JTkNbXCIwOTA0NENcIl0uXG4gIFwibGRsLWNcIjogXCIxMzQ1Ny03XCIsXG4gIGxkbDogXCIxMzQ1Ny03XCIsXG4gIFwiaGRsIGNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcImhkbC1jXCI6IFwiMjA4NS05XCIsXG4gIGhkbDogXCIyMDg1LTlcIixcbiAgLy8gVG90YWwgY2hvbGVzdGVyb2wgXHUyMDE0IGJhcmUgJ2Nob2xlc3Rlcm9sJyBvbmx5IGZpcmVzIEFGVEVSIHRoZVxuICAvLyBMREwvSERMLXByZWZpeGVkIHZhcmlhbnRzIGFib3ZlIGhhdmUgYmVlbiBjaGVja2VkLlxuICBcInRvdGFsIGNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFwidC1jaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgY2hvbGVzdGVyb2w6IFwiMjA5My0zXCIsXG4gIHRyaWdseWNlcmlkZTogXCIyNTcxLThcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIjI1NzEtOFwiLFxuICBcInVyaWMgYWNpZFwiOiBcIjMwODQtMVwiLFxuICBlZ2ZyOiBcIjMzOTE0LTNcIixcbiAgaGJzYWc6IFwiNTE5Ni0xXCIsXG4gIFwiYW50aS1oY3ZcIjogXCIxNjEyOC0xXCIsXG4gIC8vIFVyaW5lIHByb3RlaW4gKGRpc3BsYXkgZmFsbGJhY2sgZm9yIHRoZSBuby1OSEktY29kZSBwYXRoIHRoYXRcbiAgLy8gY29tZXMgZnJvbSBJSEtFMzQwMiB2aXRhbHMgKyBhZHVsdC1wcmV2ZW50aXZlIHN1cHBsZW1lbnRzKS5cbiAgXCJ1cmluZSBwcm90ZWluXCI6IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gIFwidS1wcm9cIjogXCIyMDQ1NC01XCIsXG4gIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gIC8vIEFCRyBwYW5lbCBjb21wb25lbnRzIFx1MjAxNCAwOTA0MUIgcGFyZW50IGNvZGUgaW4gTkhJX1RPX0xPSU5DOyBlYWNoXG4gIC8vIG1lbWJlcidzIGRpc3BsYXkgKFwicENPMlwiLCBcInBPMlwiLCBcIkhDTzNcIiwgXCJUQ08yXCIsIFwiU0JFL0FCRVwiLFxuICAvLyBcIlNCQ1wiLCBcIlNBVFwiIC8gXCJTYU8yXCIpIGZhbGxzIHRvIGl0cyBvd24gTE9JTkMuXG4gIC8vIHBIIE1VU1QgY29tZSBiZWZvcmUgcGNvMi9wbzIgc28gdGhlIGJhcmUgXCJwSFwiIGRpc3BsYXkgbGFuZHMgaGVyZS5cbiAgcGg6IFwiMTE1NTgtNFwiLCAvLyBwSCBvZiBBcnRlcmlhbCBibG9vZFxuICBwY28yOiBcIjIwMTktOFwiLCAvLyBDYXJib24gZGlveGlkZSBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBwbzI6IFwiMjcwMy03XCIsIC8vIE94eWdlbiBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBoY28zOiBcIjE5NTktNlwiLCAvLyBCaWNhcmJvbmF0ZSBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgYmljYXJib25hdGU6IFwiMTk1OS02XCIsXG4gIHRjbzI6IFwiMjAyOC05XCIsIC8vIFRvdGFsIENPMiBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgc2JlOiBcIjExNTU1LTBcIiwgLy8gU3RhbmRhcmQgYmFzZSBleGNlc3MgQXJ0ZXJpYWxcbiAgYWJlOiBcIjExNTU1LTBcIixcbiAgc2JjOiBcIjE5MjUtN1wiLCAvLyBTdGFuZGFyZCBiaWNhcmJvbmF0ZSBBcnRlcmlhbFxuICBzYXR1cmF0OiBcIjI3MTMtNlwiLCAvLyBPMiBzYXR1cmF0aW9uIEFydGVyaWFsXG4gIHNhbzI6IFwiMjcxMy02XCIsXG4gIHNhdDogXCIyNzEzLTZcIiwgLy8gTkhJIGRpc3BsYXkgc2hvd3MganVzdCBcIlNBVFwiXG4gIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBjb21wb25lbnRzICgxNjAwOEMgcGFyZW50IGFib3ZlKS5cbiAgXCJzZi5jb2xvclwiOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBCb2R5IGZsdWlkIChyZXVzZSBVcmluZSBjb2xvciBzcGVjIE9LKVxuICAvLyBOT1RFOiA4MjU1LTIgLyAxMzk0OC01IHByZXZpb3VzbHkgbGlzdGVkIGhlcmUgYm90aCB0dXJuZWQgb3V0XG4gIC8vIHRvIGJlIHVucmVsYXRlZCBMT0lOQ3MgKHZlcmlmaWVkIGxvaW5jLm9yZyBcdTIwMTQgODI1NS0yIGlzXG4gIC8vICdTZXJ2aWNlIGNvbW1lbnQgMTMnLCAxMzk0OC01IGlzICdDb2NjaWRpb2lkZXMgaW1taXRpcyBJZ01cbiAgLy8gQWInKS4gQm9keS1mbHVpZCBBcHBlYXJhbmNlIC8gUkJDIGRvbid0IGhhdmUgd2VsbC1hdHRlc3RlZFxuICAvLyBMT0lOQ3MgaW4gb3VyIHRhYmxlIHlldCBcdTIwMTQgZmFsbGluZyB0aHJvdWdoIHRvIGNvZGUudGV4dC1vbmx5XG4gIC8vIGlzIHNhZmVyIHRoYW4gZW1pdHRpbmcgYSBtaXNsZWFkaW5nIExPSU5DLiBUbyBhZGQgbGF0ZXIsXG4gIC8vIHZlcmlmeSBlYWNoIGFnYWluc3QgbG9pbmMub3JnIGZpcnN0LlxuICBcInNmLndiY1wiOiBcIjI2NDY2LTNcIiwgLy8gV0JDICMvdm9sIEJvZHkgZmx1aWRcbiAgXCJzZi5uZXV0cm9waGlsXCI6IFwiMTAzMjgtNlwiLCAvLyBOZXV0cm9waGlscy8xMDAgbGV1a29jeXRlcyBpbiBCb2R5IGZsdWlkXG4gIFwic2YubHltcGhvXCI6IFwiMTMwNDYtOFwiLCAvLyBMeW1waG9jeXRlcyAjL3ZvbCBCb2R5IGZsdWlkXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX0RJU1BMQVkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDYW5vbmljYWwgRW5nbGlzaCBkaXNwbGF5IG5hbWVzIGZvciBMT0lOQyBjb2RlcyB0aGUgYnJpZGdlIGVtaXRzLlxuLy8gRmFsbHMgYmFjayB0byB0aGUgcmF3IGlucHV0IGRpc3BsYXkgd2hlbiBhIExPSU5DIGlzbid0IGxpc3RlZCBoZXJlLlxuLy8gU291cmNlZCBmcm9tIGxvaW5jLm9yZyBjYW5vbmljYWwgc2hvcnQgbmFtZXMgd2hlcmUgYXBwbGljYWJsZS5cbi8vIEFkZCBuZXcgZW50cmllcyBhcyB3ZSB3aWRlbiBMT0lOQyBjb3ZlcmFnZSBcdTIwMTQgdGhlIGxvb2t1cCBpcyBrZXllZCBvblxuLy8gTE9JTkMgc3RyaW5nLCBzbyB1bm1hcHBlZCBMT0lOQ3MgZGVncmFkZSBncmFjZWZ1bGx5IHRvIHRoZSBOSEkgdGV4dC5cbmV4cG9ydCBjb25zdCBMT0lOQ19ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3QgY3JpdGljYWwgYmxvY2sgXHUyMDE0IE5ISSdzIFwiQ29sb3IgXHU1QzNGIFx1OTg0RiAgLi4uXCIgc3R5bGUgbGFiZWxzIGFyZVxuICAvLyB3aGF0IHRyaWdnZXJzIGRvd25zdHJlYW0gQ2hpbmVzZS1zdWJzdHJpbmcgbGFiZWxsaW5nIGJ1Z3MuXG4gIFwiNTgwMy0yXCI6IFwicEggb2YgVXJpbmVcIixcbiAgXCI1ODExLTVcIjogXCJTcGVjaWZpYyBncmF2aXR5IG9mIFVyaW5lXCIsXG4gIFwiNTc3MC0zXCI6IFwiQmlsaXJ1YmluIFVyaW5lIFFsXCIsXG4gIFwiNTgwMi00XCI6IFwiTml0cml0ZSBVcmluZSBRbFwiLFxuICBcIjU3NzgtNlwiOiBcIkNvbG9yIG9mIFVyaW5lXCIsXG4gIFwiNTc2Ny05XCI6IFwiQXBwZWFyYW5jZSBvZiBVcmluZVwiLFxuICBcIjU4MTgtMFwiOiBcIlVyb2JpbGlub2dlbiBVcmluZSBRbFwiLFxuICBcIjIwNDU0LTVcIjogXCJQcm90ZWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTctNVwiOiBcIk1pY3JvYWxidW1pbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU5LTFcIjogXCJNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSBSYXRpbyBpbiBVcmluZVwiLFxuICBcIjU3OTItN1wiOiBcIkdsdWNvc2UgVXJpbmUgUWxcIixcbiAgXCI1Nzk3LTZcIjogXCJLZXRvbmVzIFVyaW5lIFFsXCIsXG4gIFwiNTc5NC0zXCI6IFwiSGVtb2dsb2JpbiBVcmluZSBRbFwiLFxuICBcIjU3OTktMlwiOiBcIkxldWtvY3l0ZXMgVXJpbmUgUWxcIixcbiAgXCIyNDM1Ni04XCI6IFwiVXJpbmFseXNpcyBNYWNybyBQYW5lbFwiLFxuICAvLyBBTEwgZW50cmllcyBiZWxvdyB1c2UgdGhlIExPSU5DIGNhbm9uaWNhbCAnTG9uZyBDb21tb24gTmFtZSdcbiAgLy8gYXMgYWNjZXB0ZWQgYnkgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IuIFNvdXJjZTogbG9pbmMub3JnIGZvclxuICAvLyBlYWNoIGNvZGUsIGNyb3NzLWNoZWNrZWQgYWdhaW5zdCB0aGUgdmFsaWRhdG9yJ3MgcmVwb3J0ZWRcbiAgLy8gJ1ZhbGlkIGRpc3BsYXkgaXMgb25lIG9mIE4gY2hvaWNlcycgZm9yIGRpc3BsYXlzIHdlIHByZXZpb3VzbHlcbiAgLy8gZ290IHdyb25nICg0NSBMT0lOQ3MgZm91bmQgaW4gdGhlIFAzMzMzMzMzMzMgdmFsaWRhdGlvbiBydW4pLlxuICAvLyBXaGVuIHVwZGF0aW5nLCBjb3B5IHRoZSBleGFjdCBlbi1VUyBsb25nIG5hbWUgZnJvbSBsb2luYy5vcmcgXHUyMDE0XG4gIC8vIHRoZSB2YWxpZGF0b3IgaXMgc2Vuc2l0aXZlIHRvIHNwZWxsaW5nIC8gcHVuY3R1YXRpb24uXG4gIC8vXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyAoMDkwNDFCIHBhbmVsKSBcdTIwMTQgbm90IGluIHZhbGlkYXRvciBvdXRwdXQ7IGxvaW5jLm9yZyBzb3VyY2VkXG4gIFwiMTE1NTgtNFwiOiBcInBIIG9mIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAxOS04XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjcwMy03XCI6IFwiT3h5Z2VuIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjE5NTktNlwiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAyOC05XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTE1NTUtMFwiOiBcIkJhc2UgZXhjZXNzIGluIEFydGVyaWFsIGJsb29kIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIFwiMTkyNS03XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2QgLS1zdGFuZGFyZFwiLFxuICBcIjI3MTMtNlwiOiBcIk94eWdlbiBzYXR1cmF0aW9uIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE1NTgtNlwiOiBcIkZhc3RpbmcgZ2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzNDUtN1wiOiBcIkdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzE4LTdcIjogXCJIZW1vZ2xvYmluIFtNYXNzL3ZvbHVtZV0gaW4gQmxvb2RcIixcbiAgXCI0NTQ4LTRcIjogXCJIZW1vZ2xvYmluIEExYy9IZW1vZ2xvYmluLnRvdGFsIGluIEJsb29kXCIsXG4gIFwiNjY5MC0yXCI6IFwiTGV1a29jeXRlcyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzc3LTNcIjogXCJQbGF0ZWxldHMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODUtNlwiOiBcIk1DSCBbRW50aXRpYyBtYXNzXSBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3MTEtMlwiOiBcIkVvc2lub3BoaWxzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI0NTQ0LTNcIjogXCJIZW1hdG9jcml0IFtWb2x1bWUgRnJhY3Rpb25dIG9mIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjU3MDIxLThcIjogXCJDQkMgVyBBdXRvIERpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIFwiMjQzMTctMFwiOiBcIkhlbW9ncmFtIGFuZCBwbGF0ZWxldHMgV08gZGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSAvIGxpdmVyIC8gcmVuYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTkyMC04XCI6IFwiQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NDItNlwiOiBcIkFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MC0wXCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjEtOFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBVcmluZVwiLFxuICBcIjMzOTE0LTNcIjpcbiAgICBcIkdsb21lcnVsYXIgZmlsdHJhdGlvbiByYXRlIFtWb2x1bWUgUmF0ZS9BcmVhXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgQ3JlYXRpbmluZS1iYXNlZCBmb3JtdWxhIChNRFJEKS8xLjczIHNxIE1cIixcbiAgXCIzMDk0LTBcIjogXCJVcmVhIG5pdHJvZ2VuIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzA4NC0xXCI6IFwiVXJhdGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTUxLTJcIjogXCJTb2RpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjgyMy0zXCI6IFwiUG90YXNzaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NzUtMlwiOiBcIkJpbGlydWJpbi50b3RhbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NjgtN1wiOiBcIkJpbGlydWJpbi5kaXJlY3QgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzUxLTdcIjogXCJBbGJ1bWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjUzMi0wXCI6IFwiTGFjdGF0ZSBkZWh5ZHJvZ2VuYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI2NzY4LTZcIjogXCJBbGthbGluZSBwaG9zcGhhdGFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjMyNC0yXCI6IFwiR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3ODYxLTZcIjogXCJDYWxjaXVtIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIyMDkzLTNcIjogXCJDaG9sZXN0ZXJvbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1NzEtOFwiOiBcIlRyaWdseWNlcmlkZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIwODUtOVwiOiBcIkNob2xlc3Rlcm9sIGluIEhETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjEzNDU3LTdcIjogXCJDaG9sZXN0ZXJvbCBpbiBMREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgY2FsY3VsYXRpb25cIixcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgLyBob3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIzMDE2LTNcIjogXCJUaHlyb3Ryb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDI0LTdcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk4Ni04XCI6IFwiVGVzdG9zdGVyb25lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiODMwOTgtNFwiOiBcIkZvbGxpdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICBcIjgzMDk2LThcIjogXCJFc3RyYWRpb2wgKEUyKSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMDgzOS05XCI6IFwiVHJvcG9uaW4gSS5jYXJkaWFjIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM3NjItNlwiOiBcIk5hdHJpdXJldGljIHBlcHRpZGUuQiBwcm9ob3Jtb25lIE4tVGVybWluYWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTg4LTVcIjogXCJDIHJlYWN0aXZlIHByb3RlaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzk1OS04XCI6IFwiUHJvY2FsY2l0b25pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIC8gc2Vyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNTE5NS0zXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiNTE5Ni0xXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bVwiLFxuICBcIjE2MTI4LTFcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiMTM5NTUtMFwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDb2FndWxhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI2MzAxLTZcIjogXCJJTlIgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIxNDk3OS05XCI6IFwiYVBUVCBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjMwMjQwLTZcIjogXCJGaWJyaW4gRC1kaW1lciBbTWFzcy92b2x1bWVdIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbCBzaWducyAoSUhLRTM0MDIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjgzMDItMlwiOiBcIkJvZHkgaGVpZ2h0XCIsXG4gIFwiMjk0NjMtN1wiOiBcIkJvZHkgd2VpZ2h0XCIsXG4gIFwiMzkxNTYtNVwiOiBcIkJvZHkgbWFzcyBpbmRleCAoQk1JKSBbUmF0aW9dXCIsXG4gIFwiODI4MC0wXCI6IFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZSBhdCB1bWJpbGljdXMgYnkgVGFwZSBtZWFzdXJlXCIsXG4gIFwiODQ4MC02XCI6IFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NDYyLTRcIjogXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NTM1NC05XCI6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWwgd2l0aCBhbGwgY2hpbGRyZW4gb3B0aW9uYWxcIixcbn07XG4iLCAiLyoqXG4gKiBQdXJlIHBhcnNpbmcgaGVscGVycyBcdTIwMTQgcmVmZXJlbmNlIHJhbmdlLCBxdWFudGl0eSwgVUNVTSB1bml0IG5vcm1hbGlzYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19wYXJzZXJzLnB5YC4gU2VsZi1jb250YWluZWQ6IG5vIGRlcGVuZGVuY2llc1xuICogb24gb3RoZXIgb2JzZXJ2YXRpb24gbW9kdWxlIHBpZWNlcy5cbiAqXG4gKiBQdWJsaWMgQVBJOlxuICogICB0b1VjdW0odW5pdCkgICAgICAgICAgICAgICAgICBcdTIxOTIgY2Fub25pY2FsIFVDVU0gdW5pdCBzdHJpbmcgKG9yIG51bGwpXG4gKiAgIHBhcnNlUmFuZ2VNdWx0aShyYXcsIHVuaXQpICAgIFx1MjE5MiBsaXN0IG9mIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cmllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbmUgcGVyIHNleCB3aGVuIHNleC1zdHJhdGlmaWVkKVxuICogICBwYXJzZVJhbmdlKHJhdywgdW5pdCkgICAgICAgICBcdTIxOTIgc2luZ2xlIHJlZmVyZW5jZVJhbmdlIGVudHJ5XG4gKiAgIHRyeVBhcnNlUXVhbnRpdHkocmF3LCB1bml0KSAgIFx1MjE5MiBGSElSIFF1YW50aXR5IGRpY3Qgb3IgbnVsbFxuICovXG5cbmNvbnN0IFVDVU1fU1lTVEVNID0gXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCI7XG5cbi8vIEZISVIgUjQgUXVhbnRpdHkuY29tcGFyYXRvciBhbGxvd2VkIHZhbHVlcy4gTm9ybWFsaXNlIGZ1bGwtd2lkdGggQ0pLXG4vLyBcdUZGMUUgXHVGRjFDIFx1MjI2NyBcdTIyNjYgKyBBU0NJSSB2YXJpYW50cyBzbyBcIlx1RkYxRSA0MC4wXCIgc3RpbGwgcGFyc2VzIGFzIGEgcmVhbCBudW1iZXJcbi8vIGluc3RlYWQgb2YgZmFsbGluZyB0aHJvdWdoIHRvIHZhbHVlU3RyaW5nICh3aGljaCBsb3NlcyB0aGUgdW5pdCkuXG5jb25zdCBGVUxMV0lEVEhfT1BTOiBSZWFkb25seUFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICBbXCJcdUZGMUVcIiwgXCI+XCJdLFxuICBbXCJcdUZGMUNcIiwgXCI8XCJdLFxuICBbXCJcdTIyNjdcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY2XCIsIFwiPD1cIl0sXG4gIFtcIlx1MjI2NVwiLCBcIj49XCJdLFxuICBbXCJcdTIyNjRcIiwgXCI8PVwiXSxcbl07XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUZ1bGx3aWR0aChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gcztcbiAgZm9yIChjb25zdCBbZnJvbSwgdG9dIG9mIEZVTExXSURUSF9PUFMpIHtcbiAgICBpZiAob3V0LmluY2x1ZGVzKGZyb20pKSB7XG4gICAgICBvdXQgPSBvdXQuc3BsaXQoZnJvbSkuam9pbih0byk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IENPTVBBUkFUT1JfUkUgPSAvXlxccyooPD18Pj18PHw+KVxccyooLispJC87XG5cbi8vIFJlZmVyZW5jZS1yYW5nZSBwYXJzaW5nLiBOSEkgc2hpcHMgdGhlIHJhbmdlIGFzIHBsYWluIHRleHQgbGlrZVxuLy8gXCJbMy44OV1bMjYuOF1cIiwgXCJbNDBdW11cIiwgXCJbTmVnYXRpdmVdXCIgb3IgXCJBTSA4OjAwIDYuMi0xOS40XCIuXG5jb25zdCBSUl9MT1dISUdIX0JSQUNLRVRTID0gL15cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9EQVNIX1JBTkdFID0gLygtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlstflx1MjAxM11cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvO1xuY29uc3QgUlJfQ09NUEFSQVRPUiA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKiQvO1xuLy8gU2V4LXN0cmF0aWZpZWQgYnJhY2tldGVkIHJhbmdlLCBlLmcuIFwiXHU3NTM3OjEzLjcgXHU1OTczOjExLjFcIiBcdTIwMTQgdXNlZCBieSBzb21lXG4vLyBob3NwaXRhbHMgZm9yIGhhZW1hdG9sb2d5IChIYiwgUkJDLCBIY3QpLiBQdWxscyBvdXQgKHNleCwgdmFsdWUpIHBhaXJzLlxuLy8gVG9sZXJhdGVzIG9wdGlvbmFsIGNvbXBhcmF0b3IgKFx1MjI2Ny9cdTIyNjYvPi88KSBiZWZvcmUgdGhlIG51bWJlci5cbmNvbnN0IFJSX1NFWF9OVU1fRyA9IC8oXHU3NTM3XHU2MDI3fFx1NTk3M1x1NjAyN3xcdTc1Mzd8XHU1OTczfE18RilcXHMqWzpcdUZGMUFdP1xccyooPzpbPD5cdTIyNjdcdTIyNjZdPT8pP1xccyooLT9cXGQrKD86XFwuXFxkKyk/KS9nO1xuY29uc3QgUlJfU0lOR0xFX0JSQUNLRVQgPSAvXlxccypcXFtcXHMqKC4rPylcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfUVVBTElUQVRJVkVfUEFSRU4gPVxuICAvXlxccyooTm9ybWFsfFx1NkI2M1x1NUUzOHxOb25yZWFjdGl2ZXxOb24tcmVhY3RpdmUpXFxzKlxcKFxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccypcXClcXHMqJC9pO1xuXG5jb25zdCBTRVhfVE9fRkhJUjogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIFx1NzUzN1x1NjAyNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NzUzNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIE06IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTU5NzNcdTYwMjc6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgXHU1OTczOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIEY6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbn07XG5cbi8vIFB1YmxpYyB0eXBlcyBcdTIwMTQgRkhJUiBRdWFudGl0eSAvIHJlZmVyZW5jZVJhbmdlIHNoYXBlcyB1c2VkIGRvd25zdHJlYW0uXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50aXR5IHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdD86IHN0cmluZztcbiAgc3lzdGVtPzogc3RyaW5nO1xuICBjb2RlPzogc3RyaW5nO1xuICBjb21wYXJhdG9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlRW50cnkge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxvdz86IFF1YW50aXR5O1xuICBoaWdoPzogUXVhbnRpdHk7XG4gIGFwcGxpZXNUbz86IEFycmF5PHtcbiAgICBjb2Rpbmc6IEFycmF5PHsgc3lzdGVtOiBzdHJpbmc7IGNvZGU6IHN0cmluZzsgZGlzcGxheTogc3RyaW5nIH0+O1xuICAgIHRleHQ6IHN0cmluZztcbiAgfT47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVQ1VNIG5vcm1hbGlzYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTkhJIGxhYnMgcmVwb3J0IHVuaXRzIGluIGEgbWl4IG9mIFVDVU0tY2xlYW4gc3RyaW5ncyAoJ21nL2RMJyksXG4gKiBUYWl3YW4tc3R5bGUgZXF1aXZhbGVudHMgKCdtRXEvTCcgdnMgVUNVTSAnbWVxL0wnKSwgZnVsbC13aWR0aCBwdW5jdHVhdGlvblxuICogKCdcdUZGMDUnIHZzICclJyksIGFuZCBwbGFjZWhvbGRlciB0ZXh0ICgnXHU3MTIxJykuIFRoZSBUV05ISUZISVIgdmFsaWRhdG9yXG4gKiByZWplY3RzIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbm9uaWNhbCBVQ1VNIGluIFF1YW50aXR5LmNvZGUsIHNvIHdlXG4gKiBub3JtYWxpc2UuIGBudWxsYCBtZWFucyBcIm9taXQgUXVhbnRpdHkuY29kZSBlbnRpcmVseVwiLlxuICovXG5jb25zdCBVQ1VNX09WRVJSSURFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVsbD4gPSB7XG4gIC8vIEZ1bGx3aWR0aCBcdTIxOTIgQVNDSUlcbiAgXCJcdUZGMDVcIjogXCIlXCIsXG4gIC8vIENhc2Utc2Vuc2l0aXZlIFVDVU0gKEVxIGlzICdlcScsIG5vdCAnRXEnKVxuICBcIm1FcS9MXCI6IFwibWVxL0xcIixcbiAgXCJtZXEvbFwiOiBcIm1lcS9MXCIsXG4gIC8vIEJQIHByb2ZpbGUgZml4ZWQtdmFsdWU6IG1tW0hnXSBub3QgbW1IZ1xuICBtbUhnOiBcIm1tW0hnXVwiLFxuICBNTUhHOiBcIm1tW0hnXVwiLFxuICAvLyBDb21tb24gQ2hpbmVzZSAnbm8gdW5pdCcgcGxhY2Vob2xkZXJzIFx1MjE5MiBkcm9wIFVDVU0gY29kZVxuICBcdTcxMjE6IG51bGwsXG4gIFwiXCI6IG51bGwsXG4gIFwiXHUyMDE0XCI6IG51bGwsXG4gIFwiLVwiOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVWN1bSh1bml0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdW5pdCkgcmV0dXJuIG51bGw7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoVUNVTV9PVkVSUklERVMsIHVuaXQpKSB7XG4gICAgcmV0dXJuIFVDVU1fT1ZFUlJJREVTW3VuaXRdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIHVuaXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBRdWFudGl0eSBidWlsZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBtYWtlUXVhbnRpdHkodmFsdWU6IG51bWJlciwgdW5pdDogc3RyaW5nKTogUXVhbnRpdHkge1xuICBjb25zdCBxOiBRdWFudGl0eSA9IHsgdmFsdWUgfTtcbiAgaWYgKHVuaXQpIHtcbiAgICBxLnVuaXQgPSB1bml0O1xuICAgIHEuc3lzdGVtID0gVUNVTV9TWVNURU07XG4gICAgcS5jb2RlID0gdW5pdDtcbiAgfVxuICByZXR1cm4gcTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VGbG9hdChzOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHMgPT09IFwiXCIgfHwgcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgLy8gTWlycm9yIFB5dGhvbidzIGZsb2F0KCkgXHUyMDE0IGFsbG93IGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSxcbiAgLy8gb3B0aW9uYWwgc2lnbiwgZGVjaW1hbC4gUmVqZWN0IGlmIE5hTiBPUiBpZiBhbnkgbm9uLW51bWVyaWMgcmVzaWR1YWxcbiAgLy8gKE51bWJlcihcIjEyYWJjXCIpIHJldHVybnMgTmFOLCBPSzsgXCIxMiAgYWJjXCIgYWxzbyBOYU4sIE9LKS5cbiAgY29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG4gPSBOdW1iZXIodHJpbW1lZCk7XG4gIGlmIChOdW1iZXIuaXNOYU4obikpIHJldHVybiBudWxsO1xuICByZXR1cm4gbjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHBhcnNlUmFuZ2VNdWx0aSAvIHBhcnNlUmFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTGlzdCB2YXJpYW50IG9mIHBhcnNlUmFuZ2U6IGVtaXRzIG9uZSBlbnRyeSBwZXIgc2V4IHdoZW4gdGhlIHJhbmdlIGlzXG4gKiBzZXgtc3RyYXRpZmllZCAoXCJbXHU3NTM3OjEzLjcgXHU1OTczOjExLjFdW1x1NzUzNzoxNy4wIFx1NTk3MzoxNS4wXVwiKSwgb3RoZXJ3aXNlIGFcbiAqIHNpbmdsZS1lbGVtZW50IGxpc3QuIEVhY2ggZW50cnkgdGFnZ2VkIHdpdGggYXBwbGllc1RvIHNvIGRvd25zdHJlYW1cbiAqIGNvZGUgY2FuIHBpY2sgdGhlIHJpZ2h0IG9uZSBmb3IgdGhlIHBhdGllbnQncyBzZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlTXVsdGkocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeVtdIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gW107XG5cbiAgY29uc3QgbG93QnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaGlnaEJ5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCB1c2VkTXVsdGkgPSBmYWxzZTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsb3dCbG9iID0gbVsxXSA/PyBcIlwiO1xuICAgIGNvbnN0IGhpZ2hCbG9iID0gbVsyXSA/PyBcIlwiO1xuICAgIGZvciAoY29uc3Qgc20gb2YgbG93QmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGxvd0J5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNtIG9mIGhpZ2hCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgaGlnaEJ5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2luZ2xlLWJyYWNrZXQ6IGVhY2ggcGVyLXNleCB2YWx1ZSdzIGNvbXBhcmF0b3IgZGVjaWRlcyBsb3cgdnMgaGlnaC5cbiAgICBjb25zdCBzaW5nbGUgPSBzLm1hdGNoKFJSX1NJTkdMRV9CUkFDS0VUKTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNpbmdsZVsxXSA/PyBcIlwiO1xuICAgICAgZm9yIChjb25zdCBzbSBvZiBpbm5lci5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICAgIGNvbnN0IHNleEtleSA9IHNtWzFdID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHNtWzJdID8/IFwiXCI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbXBhcmF0b3IgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoaXMgbnVtYmVyLlxuICAgICAgICAvLyBNaXJyb3IgdGhlIFB5dGhvbjogcmVidWlsZCBhIHBlci1zZXgta2V5IHNlYXJjaC5cbiAgICAgICAgY29uc3QgcGF0ID0gbmV3IFJlZ0V4cChgJHtlc2NhcGVSZWdleChzZXhLZXkpfVxcXFxzKls6XHVGRjFBXT9cXFxccyooWzw+XHUyMjY3XHUyMjY2XT0/KT9cXFxccyotP1xcXFxkYCk7XG4gICAgICAgIGNvbnN0IGNtID0gaW5uZXIubWF0Y2gocGF0KTtcbiAgICAgICAgY29uc3Qgb3AgPSBjbT8uWzFdID8/IFwiXCI7XG4gICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPFwiIHx8IG9wID09PSBcIjw9XCIpIHtcbiAgICAgICAgICBoaWdoQnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHVzZWRNdWx0aSkge1xuICAgIGNvbnN0IGVudHJpZXM6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgdW5pb24gb2Yga2V5cyBhY3R1YWxseSBzZWVuIFx1MjAxNCBwcmVzZXJ2ZSBpbnNlcnRpb24gb3JkZXIuXG4gICAgY29uc3QgYWxsU2V4S2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLk9iamVjdC5rZXlzKGxvd0J5U2V4KSwgLi4uT2JqZWN0LmtleXMoaGlnaEJ5U2V4KV0pIHtcbiAgICAgIGlmICghYWxsU2V4S2V5cy5pbmNsdWRlcyhrKSkgYWxsU2V4S2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNleEtleSBvZiBhbGxTZXhLZXlzKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gU0VYX1RPX0ZISVJbc2V4S2V5XTtcbiAgICAgIGlmICghbWFwcGluZykgY29udGludWU7XG4gICAgICBjb25zdCBbZmhpckNvZGUsIGZoaXJEaXNwbGF5XSA9IG1hcHBpbmc7XG4gICAgICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHtcbiAgICAgICAgdGV4dDogcmF3UmFuZ2UsXG4gICAgICAgIGFwcGxpZXNUbzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvYWRtaW5pc3RyYXRpdmUtZ2VuZGVyXCIsXG4gICAgICAgICAgICAgICAgY29kZTogZmhpckNvZGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmhpckRpc3BsYXksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdGV4dDogZmhpckRpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBpZiAoc2V4S2V5IGluIGxvd0J5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGxvd0J5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXhLZXkgaW4gaGlnaEJ5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGhpZ2hCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRGUtZHVwIGJ5IEZISVIgc2V4IGNvZGUgaW4gY2FzZSBpbnB1dCBoYXMgYm90aCBcdTc1MzcgYW5kIFx1NzUzN1x1NjAyNy5cbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGNvbnN0IG91dDogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cmllcykge1xuICAgICAgICBjb25zdCBjID0gZS5hcHBsaWVzVG8/LlswXT8uY29kaW5nWzBdPy5jb2RlO1xuICAgICAgICBpZiAoIWMgfHwgc2Vlbi5oYXMoYykpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChjKTtcbiAgICAgICAgb3V0LnB1c2goZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uZSA9IHBhcnNlUmFuZ2UocmF3UmFuZ2UsIHVuaXQpO1xuICByZXR1cm4gb25lID8gW29uZV0gOiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmZXJlbmNlLXJhbmdlIHRleHQgaW50byBhIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cnkuXG4gKlxuICogU3RyYXRlZ3kgaW4gb3JkZXI6XG4gKiAgIDEuIFwiW2xvd11baGlnaF1cIiBicmFja2V0ZWQgZm9ybWF0IFx1MjAxNCBOSEkncyBjYW5vbmljYWwgc2hhcGUuXG4gKiAgIDIuIFwiMy44OS0yNi44XCIgLyBcIjMuODl+MjYuOFwiIGRhc2ggcmFuZ2UuXG4gKiAgIDMuIFwiPiA0MFwiIC8gXCI8IDAuNVwiIHNpbmdsZS1zaWRlZC5cbiAqICAgNC4gUXVhbGl0YXRpdmUgKFwiTmVnYXRpdmVcIiwgXCJBTSA4OjAwIDYuMi0xOS40XCIpIFx1MjAxNCB0ZXh0LW9ubHkuXG4gKlxuICogU2V4LXN0cmF0aWZpZWQgc2hhcGVzIGdvIHRocm91Z2ggcGFyc2VSYW5nZU11bHRpLiBSZXR1cm5zIG51bGwgb25seVxuICogZm9yIGVtcHR5IGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0geyB0ZXh0OiByYXdSYW5nZSB9O1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvID0gKG1bMV0gPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IGhpID0gKG1bMl0gPz8gXCJcIikudHJpbSgpO1xuICAgIGZvciAoY29uc3QgW3NpZGUsIHNpZGVWYWxdIG9mIFtcbiAgICAgIFtcImxvd1wiLCBsb10sXG4gICAgICBbXCJoaWdoXCIsIGhpXSxcbiAgICBdIGFzIGNvbnN0KSB7XG4gICAgICBpZiAoIXNpZGVWYWwgfHwgc2lkZVZhbCA9PT0gXCJcdTcxMjFcIiB8fCBzaWRlVmFsID09PSBcIlx1N0E3QVx1NzY3RFwiKSBjb250aW51ZTtcblxuICAgICAgLy8gMS4gUGxhaW4gZmxvYXRcbiAgICAgIGNvbnN0IGFzRmxvYXQgPSB0cnlQYXJzZUZsb2F0KHNpZGVWYWwpO1xuICAgICAgaWYgKGFzRmxvYXQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlbc2lkZV0gPSBtYWtlUXVhbnRpdHkoYXNGbG9hdCwgdW5pdCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBEYXNoIHJhbmdlIFx1MjAxNCBtZWFuaW5nZnVsIG9ubHkgZm9yIGBsb3dgIHNsb3Q7IHNwbGl0cyBpbnRvIGxvdytoaWdoLlxuICAgICAgY29uc3QgZG0gPSBzaWRlVmFsLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICAgICAgaWYgKGRtICYmIHNpZGUgPT09IFwibG93XCIgJiYgZW50cnkuaGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkbVsxXSEpO1xuICAgICAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZG1bMl0hKTtcbiAgICAgICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBDb21wYXJhdG9yIChcdTIyNjc2MCwgPD0wLjA0IGV0Yy4pXG4gICAgICBjb25zdCBjbSA9IHNpZGVWYWwubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gICAgICBpZiAoY20pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBvcCA9IGNtWzFdO1xuICAgICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA0LiBcIk5vcm1hbCAoIFggKVwiIC8gXCJOb25yZWFjdGl2ZSAoIFggKVwiIFx1MjAxNCBYIGlzIHRoZSBjdXRvZmYgKGhpZ2ggYm91bmQpLlxuICAgICAgY29uc3QgcW0gPSBzaWRlVmFsLm1hdGNoKFJSX1FVQUxJVEFUSVZFX1BBUkVOKTtcbiAgICAgIGlmIChxbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChxbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgZGFzaE1hdGNoID0gcy5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgaWYgKGRhc2hNYXRjaCkge1xuICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMV0hKTtcbiAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzJdISk7XG4gICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGNtcE1hdGNoID0gcy5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgaWYgKGNtcE1hdGNoKSB7XG4gICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21wTWF0Y2hbMl0hKTtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3AgPSBjbXBNYXRjaFsxXTtcbiAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvLyBGYWxsIHRocm91Z2g6IHF1YWxpdGF0aXZlIG9yIGNvbXBsZXggXHUyMDE0IHRleHQtb25seSBpcyBGSElSLWNvcnJlY3QuXG4gIHJldHVybiBlbnRyeTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHRyeVBhcnNlUXVhbnRpdHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUGFyc2UgXCI+IDQwLjBcIiAvIFwiPDAuMDEwXCIgLyBcIjEsMjM0LjVcIiBcdTIxOTIgRkhJUiBRdWFudGl0eSB3aXRoIGNvbXBhcmF0b3IuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgcmVzaWR1YWwgYWZ0ZXIgc3RyaXBwaW5nIGEgY29tcGFyYXRvciBzdGlsbFxuICogaXNuJ3QgbnVtZXJpYyBcdTIwMTQgY2FsbGVyIGZhbGxzIGJhY2sgdG8gdmFsdWVTdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZVF1YW50aXR5KFxuICByYXdWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdW5pdDogc3RyaW5nLFxuKTogUXVhbnRpdHkgfCBudWxsIHtcbiAgaWYgKHJhd1ZhbHVlID09PSBudWxsIHx8IHJhd1ZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aChTdHJpbmcocmF3VmFsdWUpLnRyaW0oKSk7XG4gIGxldCBjb21wYXJhdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgY20gPSBzLm1hdGNoKENPTVBBUkFUT1JfUkUpO1xuICBpZiAoY20pIHtcbiAgICBjb21wYXJhdG9yID0gY21bMV0gPz8gbnVsbDtcbiAgICBzID0gKGNtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgfVxuICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChzLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdWN1bUNvZGUgPSB0b1VjdW0odW5pdCk7XG4gIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgdmFsdWU6IHYsXG4gICAgc3lzdGVtOiBVQ1VNX1NZU1RFTSxcbiAgfTtcbiAgLy8gUXVhbnRpdHkudW5pdCAoaHVtYW4tcmVhZGFibGUpIGtlZXBzIHRoZSBvcmlnaW5hbCBOSEkgbGFiZWwgc28gdXNlcnNcbiAgLy8gc3RpbGwgc2VlICdcdUZGMDUnIG9yICdtRXEvTCcgcmF3LiBRdWFudGl0eS5jb2RlIGlzIHN0cmljdCBVQ1VNIG1hY2hpbmVcbiAgLy8gY29kZS4gRHJvcCB1bml0IGRpc3BsYXkgd2hlbiBlbXB0eSBzbyB3ZSBkb24ndCBlbWl0IFwidW5pdFwiOiBcIlwiLlxuICBpZiAodW5pdCkge1xuICAgIHF0eS51bml0ID0gdW5pdDtcbiAgfVxuICBpZiAodWN1bUNvZGUgIT09IG51bGwpIHtcbiAgICBxdHkuY29kZSA9IHVjdW1Db2RlO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgcXR5LmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIHJldHVybiBxdHk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvKipcbiAqIFByb2NlZHVyZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3Byb2NlZHVyZS5weWAuIFJldHVybnMgbnVsbCBmb3IgbGlzdC1wYWdlXG4gKiByb3dzIGxhY2tpbmcgbm90ZS9ib2R5X3NpdGUgXHUyMDE0IHRoZSBhbHRlcm5hdGl2ZSBpcyB0aGUgU01BUlQgYXBwIHNob3dpbmdcbiAqIDI1IFwicHJvY2VkdXJlc1wiIGNhbGxlZCBcIk15Y29iYWN0ZXJpYSBjdWx0dXJlXCIgLyBcIlZhZ2luYWwgdWx0cmFzb3VuZFwiXG4gKiAvIGV0Yy4gd2hpY2ggYXJlIGNsaW5pY2FsbHkgd3JvbmcuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZFwiKSkgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX1BDUztcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUHJvY2VkdXJlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBub3RlID0gKChyYXcubm90ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgYm9keVNpdGUgPSAoKHJhdy5ib2R5X3NpdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbm90ZSAmJiAhYm9keVNpdGUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUHJvY2VkdXJlXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlByb2NlZHVyZVwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImNvbXBsZXRlZFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZWREYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKGJvZHlTaXRlKSB7XG4gICAgcmVzb3VyY2UuYm9keVNpdGUgPSBbeyB0ZXh0OiBib2R5U2l0ZSB9XTtcbiAgfVxuICBpZiAobm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBub3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBtYXBwZXIgZGlzcGF0Y2ggdGFibGVzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaXNwYXRjaC5weWAuIEJvdGggdGhlIHByaW1hcnkgc3RydWN0dXJlZFxuICogcGF0aCAoYC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCkgYW5kIHRoZSBMTE0gZmFsbGJhY2sgcGF0aFxuICogKGAvc3luYy91cGxvYWQtaHRtbGApIGNvbnN1bWUgdGhlIHNhbWUgdGFibGVzIHNvIG91dHB1dCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwTWVkaWNhdGlvblJlcXVlc3QsIG1hcE1lZGljYXRpb25zRGVkdXAgfSBmcm9tIFwiLi9tZWRpY2F0aW9uXCI7XG5pbXBvcnQgeyBtYXBPYnNlcnZhdGlvbiwgbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5pbXBvcnQgeyBtYXBQcm9jZWR1cmUgfSBmcm9tIFwiLi9wcm9jZWR1cmVcIjtcblxuZXhwb3J0IHR5cGUgUGVyUm93TWFwcGVyID0gKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgR3JvdXBNYXBwZXIgPSAoaXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgKHBlci1yb3cgbWFwcGVyLCBKU09OIGxpc3Qga2V5IGluc2lkZSBMTE0gcmVzcG9uc2UpLlxuICogVXNlZCBieSB0aGUgTExNIGZhbGxiYWNrIHBhdGggYWZ0ZXIgZXh0cmFjdGlvbjsgdGhlIHN0cnVjdHVyZWQgcGF0aFxuICogYWxzbyBjb25zdWx0cyBpdCBmb3IgcGVyLXJvdyByZXNvdXJjZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IExJU1RfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIFtQZXJSb3dNYXBwZXIsIHN0cmluZ10+ID0ge1xuICBvYnNlcnZhdGlvbnM6IFttYXBPYnNlcnZhdGlvbiwgXCJvYnNlcnZhdGlvbnNcIl0sXG4gIG1lZGljYXRpb25zOiBbbWFwTWVkaWNhdGlvblJlcXVlc3QsIFwibWVkaWNhdGlvbnNcIl0sXG4gIGNvbmRpdGlvbnM6IFttYXBDb25kaXRpb24sIFwiY29uZGl0aW9uc1wiXSxcbiAgYWxsZXJnaWVzOiBbbWFwQWxsZXJneUludG9sZXJhbmNlLCBcImFsbGVyZ2llc1wiXSxcbiAgZGlhZ25vc3RpY19yZXBvcnRzOiBbbWFwRGlhZ25vc3RpY1JlcG9ydCwgXCJkaWFnbm9zdGljX3JlcG9ydHNcIl0sXG4gIHByb2NlZHVyZXM6IFttYXBQcm9jZWR1cmUsIFwicHJvY2VkdXJlc1wiXSxcbiAgZW5jb3VudGVyczogW21hcEVuY291bnRlciwgXCJlbmNvdW50ZXJzXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IHAgb2Ygci5wZXJmb3JtZXIgPz8gW10pIHtcbiAgICBjb25zdCBkID0gKHAgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBpZiAoZCkgcmV0dXJuIGQ7XG4gIH1cbiAgY29uc3QgcmVxID0gci5yZXF1ZXN0ZXIgPz8ge307XG4gIGlmIChyZXEgJiYgdHlwZW9mIHJlcSA9PT0gXCJvYmplY3RcIiAmJiByZXEuZGlzcGxheSkgcmV0dXJuIHJlcS5kaXNwbGF5O1xuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBEcm9wIEFNQiBFbmNvdW50ZXJzIHdob3NlIChob3NwaXRhbCwgc3RhcnRfZGF0ZSkgaXMgYWxyZWFkeSBjb3ZlcmVkXG4gKiBieSBhbiBJTVAgRW5jb3VudGVyJ3MgYWRtaXNzaW9uIGRheS4gTkhJIGVtaXRzIHRoZSBzYW1lIGlucGF0aWVudFxuICogc3RheSB0d2ljZSAoSUhLRTMzMDMgQU1CIGJpbGxpbmcgZW50cnkgKyBJSEtFMzMwOSBJTVAgZGV0YWlsKTsgdGhlXG4gKiBJTVAgb25lIGlzIGNhbm9uaWNhbCwgdGhlIEFNQiBpcyBhIGJpbGxpbmcgYXJ0ZWZhY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cEFkbWlzc2lvbkRheUFtYihcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBpbXBTdGFydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgaWYgKChyLmNsYXNzID8/IHt9KS5jb2RlICE9PSBcIklNUFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKGhvc3AgJiYgc3RhcnQpIGltcFN0YXJ0cy5hZGQoYCR7aG9zcH0gJHtzdGFydH1gKTtcbiAgfVxuICBpZiAoaW1wU3RhcnRzLnNpemUgPT09IDApIHJldHVybiByZXNvdXJjZXM7XG4gIHJldHVybiByZXNvdXJjZXMuZmlsdGVyKChyKSA9PiB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlID09PSBcIkVuY291bnRlclwiICYmIChyLmNsYXNzID8/IHt9KS5jb2RlID09PSBcIkFNQlwiKSB7XG4gICAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChpbXBTdGFydHMuaGFzKGAke2hvc3B9ICR7c3RhcnR9YCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBgZW5jb3VudGVyYCByZWZlcmVuY2UgdG8gZWFjaCBsaW5rYWJsZSByZXNvdXJjZSB3aGVuIGl0c1xuICogKGhvc3BpdGFsLCBkYXRlKSBtYXRjaGVzIGV4YWN0bHkgT05FIEVuY291bnRlciBpbiBgY2FuZGlkYXRlc2AuXG4gKiBDb25zZXJ2YXRpdmUgXHUyMDE0IGxlYXZlcyBhbWJpZ3VvdXMgKDAgb3IgPjEgbWF0Y2gpIGNhc2VzIHVubGlua2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlua0VuY291bnRlcnNJblJlc291cmNlcyhcbiAgY2FuZGlkYXRlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgY29uc3QgZXhhY3RJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgaW1wQnlIb3NwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZS5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoZS5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoIWhvc3AgfHwgIXN0YXJ0KSBjb250aW51ZTtcbiAgICBjb25zdCBrZXkgPSBgJHtob3NwfSAke3N0YXJ0fWA7XG4gICAgY29uc3QgYXJyID0gZXhhY3RJbmRleC5nZXQoa2V5KSA/PyBbXTtcbiAgICBhcnIucHVzaChlLmlkKTtcbiAgICBleGFjdEluZGV4LnNldChrZXksIGFycik7XG4gICAgY29uc3QgY2xzID0gKGUuY2xhc3MgPz8ge30pLmNvZGUgPz8gXCJcIjtcbiAgICBpZiAoY2xzID09PSBcIklNUFwiKSB7XG4gICAgICBjb25zdCBlbmQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5lbmQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtzdGFydCwgZW5kLCBlLmlkXSk7XG4gICAgICAgIGltcEJ5SG9zcC5zZXQoaG9zcCwgbGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4YWN0SW5kZXguc2l6ZSA9PT0gMCAmJiBpbXBCeUhvc3Auc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoIUVOQ09VTlRFUl9MSU5LQUJMRS5oYXMoci5yZXNvdXJjZVR5cGUpKSBjb250aW51ZTtcbiAgICBpZiAoci5lbmNvdW50ZXIgfHwgci5jb250ZXh0KSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gcmVzb3VyY2VIb3NwaXRhbChyKTtcbiAgICBjb25zdCBkYXRlID0gcmVzb3VyY2VEYXRlKHIpO1xuICAgIGlmICghaG9zcCB8fCAhZGF0ZSkgY29udGludWU7XG4gICAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbLi4uKGV4YWN0SW5kZXguZ2V0KGAke2hvc3B9ICR7ZGF0ZX1gKSA/PyBbXSldO1xuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc3RhcnQsIGVuZCwgZWlkXSBvZiBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdKSB7XG4gICAgICAgIGlmIChzdGFydCA8PSBkYXRlICYmIGRhdGUgPD0gZW5kKSBtYXRjaGVzLnB1c2goZWlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSAxKSBjb250aW51ZTtcbiAgICByLmVuY291bnRlciA9IHsgcmVmZXJlbmNlOiBgRW5jb3VudGVyLyR7bWF0Y2hlc1swXX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIGFuIE9ic2VydmF0aW9uIGNhcnJpZXMgbXVsdGlwbGUgcmVmZXJlbmNlUmFuZ2UgZW50cmllcyB0YWdnZWRcbiAqIHdpdGggYGFwcGxpZXNUb1sqXS5jb2RpbmcuY29kZWAgaW4ge21hbGUsIGZlbWFsZX0sIHBpY2sgdGhlIG9uZSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBwYXRpZW50J3MgZ2VuZGVyIGFuZCByZS1kZXJpdmUgaW50ZXJwcmV0YXRpb24gYWdhaW5zdCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKFxuICBwYXRpZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKCFwYXRpZW50KSByZXR1cm47XG4gIGNvbnN0IGdlbmRlciA9IFN0cmluZyhwYXRpZW50LmdlbmRlciA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ2VuZGVyICE9PSBcIm1hbGVcIiAmJiBnZW5kZXIgIT09IFwiZmVtYWxlXCIpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIk9ic2VydmF0aW9uXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJyczogYW55W10gPSByLnJlZmVyZW5jZVJhbmdlID8/IFtdO1xuICAgIGlmIChycnMubGVuZ3RoIDwgMikgY29udGludWU7XG5cbiAgICBsZXQgbWF0Y2g6IGFueSA9IG51bGw7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBycnMpIHtcbiAgICAgIGZvciAoY29uc3QgYXAgb2YgZW50cnkuYXBwbGllc1RvID8/IFtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBhcC5jb2RpbmcgPz8gW10pIHtcbiAgICAgICAgICBpZiAoU3RyaW5nKGMuY29kZSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpID09PSBnZW5kZXIpIHtcbiAgICAgICAgICAgIG1hdGNoID0gZW50cnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgfVxuICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgci5yZWZlcmVuY2VSYW5nZSA9IFttYXRjaF07XG4gICAgY29uc3QgdmFsU3RyID1cbiAgICAgIFN0cmluZygoci52YWx1ZVF1YW50aXR5ID8/IHt9KS52YWx1ZSA/PyBcIlwiKSB8fCBTdHJpbmcoci52YWx1ZVN0cmluZyA/PyBcIlwiKTtcbiAgICBjb25zdCBuZXdJbnRlcnAgPSBkZXJpdmVJbnRlcnByZXRhdGlvbih2YWxTdHIsIHIudmFsdWVRdWFudGl0eSA/PyBudWxsLCBtYXRjaCk7XG4gICAgaWYgKG5ld0ludGVycCkge1xuICAgICAgci5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW25ld0ludGVycF0gfV07XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBQYXRpZW50IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcGF0aWVudC5weWAuIFNhbWUgcHVibGljIEFQSTpcbiAqICAgLSBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWUpIFx1MjAxNCBleHBvc2VkIGZvciB0ZXN0c1xuICogICAtIG1hcFBhdGllbnQocmF3KSBcdTIwMTQgbWFpbiBlbnRyeVxuICovXG5cbmltcG9ydCB7IG1hc2tOYW1lIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBwYXRpZW50SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgY29uc3QgcmF3TmFtZVRleHQgPSAocmF3Lm5hbWUgPz8gbnVsbCkgfHwgXCJVbmtub3duXCI7XG4gIGNvbnN0IHBob25lID0gKHJhdy5waG9uZSA/PyBudWxsKSB8fCBcIlwiO1xuICBjb25zdCBhZGRyZXNzID0gKHJhdy5hZGRyZXNzID8/IG51bGwpIHx8IFwiXCI7XG5cbiAgLy8gUGFydGlhbC1hbm9ueW1pemUgYmVmb3JlIGl0IGdvZXMgYW55d2hlcmUgZG93bnN0cmVhbS4gVGhlIFBhdGllbnRcbiAgLy8gcmVzb3VyY2UsIGl0cyBGSElSIEJ1bmRsZSwgdGhlIGJhY2tlbmQgc3RvcmUsIHRoZSBkYXNoYm9hcmQsIGFuZFxuICAvLyBhbnkgU01BUlQgYXBwIGxhdW5jaGVzIGFsbCBjb25zdW1lIHRoaXMgb3V0cHV0LCBzbyB0aGUgcmF3IG5hbWVcbiAgLy8gbmV2ZXIgbGVhdmVzIHRoZSB1c2VyJ3MgcG9wdXAgaW5wdXQgZmllbGQuXG4gIGNvbnN0IG5hbWVUZXh0ID0gbWFza05hbWUocmF3TmFtZVRleHQpO1xuXG4gIGNvbnN0IFtmYW1pbHksIGdpdmVuXSA9IHNwbGl0TmFtZShuYW1lVGV4dCk7XG4gIGNvbnN0IG5hbWVFbnRyeTogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgdXNlOiBcIm9mZmljaWFsXCIsIHRleHQ6IG5hbWVUZXh0IH07XG4gIGlmIChmYW1pbHkpIG5hbWVFbnRyeS5mYW1pbHkgPSBmYW1pbHk7XG4gIGlmIChnaXZlbi5sZW5ndGggPiAwKSBuYW1lRW50cnkuZ2l2ZW4gPSBnaXZlbjtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUGF0aWVudFwiLFxuICAgIGlkOiBwYXRpZW50SWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgIHtcbiAgICAgICAgdXNlOiBcIm9mZmljaWFsXCIsXG4gICAgICAgIHN5c3RlbTogbG9va3NMaWtlVHdOYXRpb25hbElkKHBhdGllbnRJZClcbiAgICAgICAgICA/IHN5c3RlbXMuVFdfTkFUSU9OQUxfSURcbiAgICAgICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1BBVElFTlRfTVJOLFxuICAgICAgICB2YWx1ZTogcGF0aWVudElkLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG5hbWU6IFtuYW1lRW50cnldLFxuICAgIGdlbmRlcjogbWFwR2VuZGVyKHJhdy5nZW5kZXIpLFxuICB9O1xuXG4gIGNvbnN0IGJpcnRoRGF0ZSA9IHJhdy5iaXJ0aERhdGU7XG4gIGlmIChiaXJ0aERhdGUpIHJlc291cmNlLmJpcnRoRGF0ZSA9IGJpcnRoRGF0ZTtcblxuICBpZiAocGhvbmUpIHtcbiAgICByZXNvdXJjZS50ZWxlY29tID0gW3sgc3lzdGVtOiBcInBob25lXCIsIHVzZTogXCJob21lXCIsIHZhbHVlOiBwaG9uZSB9XTtcbiAgfVxuXG4gIGlmIChhZGRyZXNzKSB7XG4gICAgcmVzb3VyY2UuYWRkcmVzcyA9IFt7IHVzZTogXCJob21lXCIsIHRleHQ6IGFkZHJlc3MgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogU3BsaXQgYSBmdWxsIG5hbWUgaW50byBbZmFtaWx5LCBbZ2l2ZW5dXSBmb3IgRkhJUiBQYXRpZW50Lm5hbWUuXG4gKlxuICogSGV1cmlzdGljczpcbiAqICAgLSBDb250YWlucyB3aGl0ZXNwYWNlIFx1MjE5MiBXZXN0ZXJuOiBsYXN0IHRva2VuID0gZmFtaWx5LCByZXN0ID0gZ2l2ZW4uXG4gKiAgIC0gQ0pLIC8gc2luZ2xlLXRva2VuIFx1MjE5MiBmaXJzdCBjaGFyID0gZmFtaWx5LCByZW1haW5kZXIgPSBnaXZlbi5cbiAqICAgLSBcIlVua25vd25cIiBvciBlbXB0eSBcdTIxOTIgW1wiXCIsIFtdXVxuICpcbiAqIFR3by1jaGFyIENKSyBmYW1pbHkgbmFtZXMgKFx1NkI1MFx1OTY3RCwgXHU1M0Y4XHU5OUFDLCBcdTIwMjYpIGFyZSBOT1QgYXV0by1kZXRlY3RlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXROYW1lKGZ1bGxOYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmdbXV0ge1xuICBjb25zdCBuYW1lID0gKGZ1bGxOYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiVW5rbm93blwiKSByZXR1cm4gW1wiXCIsIFtdXTtcbiAgaWYgKC9cXHMvLnRlc3QobmFtZSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW3BhcnRzW3BhcnRzLmxlbmd0aCAtIDFdISwgcGFydHMuc2xpY2UoMCwgLTEpXTtcbiAgfVxuICAvLyBDSksgZmFsbGJhY2sgXHUyMDE0IGl0ZXJhdGUgY29kZXBvaW50cywgbm90IFVURi0xNiBjb2RlIHVuaXRzLCBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIChyYXJlIGluIENoaW5lc2UgbmFtZXMgYnV0IHBvc3NpYmxlKVxuICAvLyBkb24ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY29kZXBvaW50cyA9IEFycmF5LmZyb20obmFtZSk7XG4gIHJldHVybiBjb2RlcG9pbnRzLmxlbmd0aCA+IDEgPyBbY29kZXBvaW50c1swXSEsIFtjb2RlcG9pbnRzLnNsaWNlKDEpLmpvaW4oXCJcIildXSA6IFtuYW1lLCBbXV07XG59XG5cbmZ1bmN0aW9uIG1hcEdlbmRlcihnZW5kZXI6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBnID0gdHlwZW9mIGdlbmRlciA9PT0gXCJzdHJpbmdcIiA/IGdlbmRlci50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKFtcIm1hbGVcIiwgXCJtXCIsIFwiXHU3NTM3XCIsIFwiXHU3NTM3XHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJtYWxlXCI7XG4gIGlmIChbXCJmZW1hbGVcIiwgXCJmXCIsIFwiXHU1OTczXCIsIFwiXHU1OTczXHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJmZW1hbGVcIjtcbiAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuIiwgIi8vIFNlcnZpY2Ugd29ya2VyIGZvciBOSEktRkhJUiBCcmlkZ2UgXHUyMDE0IG93bnMgdGhlIGxvbmctcnVubmluZ1xuLy8gXCJTeW5jIFRoaXMgUGF0aWVudFwiIHdvcmtmbG93IHNvIHRoZSBwb3B1cCBjYW4gY2xvc2UgbWlkLXN5bmMgd2l0aG91dFxuLy8gYWJvcnRpbmcgaXQuXG4vL1xuLy8gTGlmZWN5Y2xlOlxuLy8gICAtIHBvcHVwIHBvc3RzIHt0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLCBwYXlsb2FkfSAgXHUyMTkyIE5ISSBKU09OLUFQSSBzeW5jXG4vLyAgIC0gYmFja2dyb3VuZCBydW5zIHRoZSBmdWxsIHN5bmMgc2VxdWVuY2UsIHVwZGF0aW5nIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyAgIC0gcG9wdXAgcmVhZHMgY2hyb21lLnN0b3JhZ2UubG9jYWwgb24gcmVvcGVuIHRvIHNob3cgcHJvZ3Jlc3Ncbi8vXG4vLyBNb2Rlczpcbi8vICAgLSBcImxvY2FsXCIgICBcdTIxOTIgYWZ0ZXIgTkhJIGZldGNoLCBydW4gbWFwcGVycyBpbi1leHRlbnNpb24sIGRvd25sb2FkIGFcbi8vICAgICAgICAgICAgICAgICBGSElSIEJ1bmRsZSB0byB0aGUgdXNlcidzIG1hY2hpbmUuIE5vIGJhY2tlbmQgcmVxdWlyZWQuXG4vLyAgIC0gXCJiYWNrZW5kXCIgXHUyMTkyIFBPU1QgcGVyLXBhZ2VfdHlwZSBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZFxuLy8gICAgICAgICAgICAgICAgIChleGlzdGluZyBiZWhhdmlvdXIpOyBkYXNoYm9hcmQgKyBTTUFSVCBhcHAgdXNlIHRoZVxuLy8gICAgICAgICAgICAgICAgIGJhY2tlbmQncyBGSElSIHN0b3JlLlxuXG5pbXBvcnQge1xuICBHUk9VUF9IQU5ETEVSUyxcbiAgTElTVF9IQU5ETEVSUyxcbiAgZGVkdXBBZG1pc3Npb25EYXlBbWIsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tOYW1lLFxuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyxcbn0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZnVuY3Rpb24gaXNvVG9ST0MoaXNvRGF0ZSkge1xuICBpZiAoIWlzb0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKGlzb0RhdGUpLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgLSAxOTExO1xuICBpZiAoeSA8IDEpIHJldHVybiBcIlwiOyAvLyBwcmUtXHU2QzExXHU1NzBCIGRhdGVzIG1ha2Ugbm8gc2Vuc2UgdG8gTkhJXG4gIHJldHVybiBgJHt5fS8ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS8ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIE5ISSBiaWxpbmd1YWwgZmllbGRzIHVzZSBcIlx1NEUyRFx1NjU4N3x8RW5nbGlzaFwiIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmYXN0ZXIsXG4vLyBzbyBwcmVmZXIgdGhhdCBzaWRlLiBJZiB0aGVyZSdzIG5vIGB8fGAgd2UganVzdCByZXR1cm4gdGhlIGlucHV0IHRyaW1tZWQuXG5mdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIElNUE9SVEFOVDogYG9yZGVyX3Nob3J0bmFtZWAgaXMgTkhJJ3MgVUktdHJ1bmNhdGVkIGxhYmVsICh+MTUgY2hhcnNcbiAgLy8gKyBcIiAuLi5cIiksIHN1aXRhYmxlIGZvciB0aGVpciBsb25nLXRhYmxlIGRpc3BsYXkgYnV0IE5PVCBmb3IgRkhJUlxuICAvLyBPYnNlcnZhdGlvbi5jb2RlLnRleHQgXHUyMDE0IGRvd25zdHJlYW0gU01BUlQgYXBwcyBlbmQgdXAgc2hvd2luZyBoYWxmXG4gIC8vIG5hbWVzIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIgd2l0aCBubyBmaWVsZCB0byByZWNvdmVyIHRoZSBmdWxsXG4gIC8vIG5hbWUgZnJvbS4gQWx3YXlzIHByZWZlciBgYXNzYVlfSVRFTV9OQU1FYCAodGhlIGZ1bGwgaXRlbSBuYW1lLFxuICAvLyB0eXBpY2FsbHkgYmlsaW5ndWFsIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOENcdTUxNjlcdTVDMEZcdTY2NDJcdTg4NDBcdTdDRDZcIikgYW5kIG9ubHkgZmFsbFxuICAvLyBiYWNrIHRvIHRoZSBzaG9ydG5hbWUgd2hlbiB0aGUgZnVsbCBuYW1lIGlzIGdlbnVpbmVseSBhYnNlbnQuXG4gIC8vIFNhbWUgcHJpb3JpdHkgYXBwbGllZCB0byBgY29kZWAgYW5kIGBkaXNwbGF5YCBzbyBib3RoXG4gIC8vIE9ic2VydmF0aW9uLmNvZGUudGV4dCBhbmQgY29kaW5nW10uZGlzcGxheSBjYXJyeSB0aGUgZnVsbCBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLm9yZGVyX3Nob3J0bmFtZSB8fCBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgb3JkZXJfY29kZTogaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgY29kZTogZnVsbE5hbWUsXG4gICAgZGlzcGxheTogZnVsbE5hbWUsXG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgdW5pdDogaXRlbS51bmlUX0RBVEEgfHwgXCJcIixcbiAgICByZWZlcmVuY2VfcmFuZ2U6IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBpdGVtLnNob3J0X0NPTlNVTFRfVkFMVUUgfHwgXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDZTMDEgcmV0dXJucyB2aXNpdC1sZXZlbCByb3dzIE9OTFkgKG5vIGRydWcgbmFtZXMpLiBUaGUgYWN0dWFsIGRydWdcbi8vIGxpc3QgbGl2ZXMgYXQgSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiwgaW5cbi8vIGBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0YC4gV2UgZG8gdGhhdCAyLXN0ZXBcbi8vIGZldGNoIHNlcGFyYXRlbHk7IHRoaXMgZnVuY3Rpb24gYWRhcHRzIGEgc2luZ2xlIGRydWcgZW50cnkgZ2l2ZW4gaXRzXG4vLyBwYXJlbnQgdmlzaXQgY29udGV4dC5cbmZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXlzID0gTnVtYmVyKGRydWcub3JkZXJfZHJ1Z19kYXkgfHwgZHJ1Zy5vcmRlcl9EUlVHX0RBWSB8fCAwKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGRydWdfbmFtZSxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIC8vIHBpY2tFbmdsaXNoIG9uIGljZF9uYW1lIHR1cm5zIFx1ODI2Rlx1NjAyN1x1NjUxRFx1OEI3N1x1ODE3QS4uLnx8QmVuaWduIHByb3N0YXRpYy4uLiBpbnRvIHRoZSBFTiBzaWRlLlxuICAgIGluZGljYXRpb246IHBpY2tFbmdsaXNoKHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIiksXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5mdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZnVuY3Rpb24gYWRhcHRBZHVsdFByZXZlbnRpdmUocm93KSB7XG4gIGlmICghcm93IHx8IHR5cGVvZiByb3cgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08ocm93LmZpcnNUX0RJQUdfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zcGl0YWwgPSByb3cuaG9zUF9BQkJSIHx8IHJvdy5ob3NwX0FCQlIgfHwgXCJcIjtcbiAgY29uc3Qgb3V0ID0gW107XG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBOSEkgY29kZSlcbiAgZnVuY3Rpb24gcHVzaChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcbiAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gICAgaWYgKHYgPT09IFwiXCIgfHwgdiA9PT0gXCItXCIgfHwgdiA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGRhdGUsXG4gICAgICBob3NwaXRhbCxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIixcbiAgICAgIG9yZGVyX2NvZGU6IGNvZGUgfHwgXCJcIixcbiAgICAgIG9yZGVyX25hbWU6IGRpc3BsYXksXG4gICAgICBjb2RlOiBjb2RlIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgICAgdmFsdWU6IHYsXG4gICAgICB1bml0OiB1bml0IHx8IFwiXCIsXG4gICAgICByZWZlcmVuY2VfcmFuZ2U6IHJlZlJhbmdlIHx8IFwiXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnNcbiAgcHVzaChcIkJvZHkgSGVpZ2h0XCIsIHJvdy5oZWlnaHQsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJvZHkgV2VpZ2h0XCIsIHJvdy53ZWlnaHQsIFwia2dcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJNSVwiLCByb3cuYm1pLCBcImtnL20yXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJXYWlzdCBDaXJjdW1mZXJlbmNlXCIsIHJvdy53YWlzdGxpbmUsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIlN5c3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX1NCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkRpYXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9FQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiVHJpZ2x5Y2VyaWRlXCIsICByb3cuYmxvRF9URywgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkhETFwiLCAgICAgICAgICAgcm93LmhkbCwgICAgIFwibWcvZExcIik7XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIpO1xuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJTR1BUIChBTFQpXCIsICAgIHJvdy5zZ3B0LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gRmFzdGluZyBnbHVjb3NlIFx1MjAxNCBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIDA5MDA1Q1xuICBwdXNoKFwiR2x1LUFDXCIsICAgICAgICByb3cuc18wOTAwNUMsIFwibWcvZExcIixcbiAgICAgICByb3cuc18wOTAwNUNfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNUNcIik7XG4gIC8vIFJlbmFsIGZ1bmN0aW9uXG4gIHB1c2goXCJCVU5cIiwgICAgICAgICAgIHJvdy51cmluRV9CVU4sICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiVXJpbmUgUHJvdGVpblwiLCByb3cudXJpbkVfUFJPVEVJTiwgXCJcIixcbiAgICAgICByb3cudXJpbkVfUFJPVEVJTl9URVhUIHx8IFwiXCIpO1xuICAvLyBIZXBhdGl0aXMgQi9DIHNjcmVlbmluZ1xuICBwdXNoKFwiSEJzQWdcIiwgICAgICAgICByb3cuaGJzYWcsICAgICAgIFwiXCIsIHJvdy5oYnNhR19URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiQW50aS1IQ1ZcIiwgICAgICByb3cuYW50SV9IQ1YsICAgIFwiXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmljIGFjaWQgXHUyMDE0IG5vdGU6IE5ISSdzIElIS0UzNDAyIHNjaGVtYSBhbHNvIGhhcyBhIGZpZWxkIGNhbGxlZFxuICAvLyBgdXJpbkVfVUFfRElBR19BQ0lEYCB0aGF0IExPT0tTIGxpa2UgdXJpbmUgVUEgYnV0IHRoZSB2YWx1ZXMgYXJlXG4gIC8vIGlkZW50aWNhbCB0byBgdXJpQ19BQ0lEYCAoc2VydW0sIG1nL2RMKS4gSXQncyBhIG1pc25hbWVkIGR1cGxpY2F0ZVxuICAvLyB3ZSBkZWxpYmVyYXRlbHkgc2tpcCBcdTIwMTQgdXNpbmcgYm90aCB3b3VsZCBjcmVhdGUgdHdvIEZISVJcbiAgLy8gT2JzZXJ2YXRpb25zIHdpdGggdGhlIHNhbWUgdmFsdWUgYnV0IGNvbnRyYWRpY3Rvcnkgc3BlY2ltZW5zLlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIik7XG4gIC8vIFVyaW5lIFVBIChxdWFsaXRhdGl2ZSB1cmluZSBkaXBzdGljayB0ZXN0IFx1MjAxNCBkaXN0aW5jdCBmcm9tIHRoZVxuICAvLyBtaXNsYWJlbGVkIHVyaW5FX1VBX0RJQUdfQUNJRCBhYm92ZTsgdGhpcyBgdXJpbkVfVUFgIGlzIHRoZSByZWFsXG4gIC8vIHVyaW5lIFVBIHJlc3VsdCwgdXN1YWxseSBhICsvLSBzdHJpbmcgb3IgZW1wdHkgd2hlbiBub3QgcnVuKS5cbiAgcHVzaChcIlVyaW5lIFVBXCIsICAgICAgcm93LnVyaW5FX1VBLCAgICBcIlwiLFxuICAgICAgIHJvdy51cmluRV9VQV9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZnVuY3Rpb24gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZShpdGVtLCBjbGFzc0hpbnQpIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY0Q5Q01fQ09ERSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKFxuICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCJcbiAgKTtcbiAgLy8gY2xhc3MgZGVmYXVsdHMgdG8gQU1COyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCBtYXkgb3ZlcnJpZGUgdG9cbiAgLy8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FIChcdTYwMjVcdThBM0EgLyBcdTRGNEZcdTk2NjIpLlxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZW5kX2RhdGU6IFwiXCIsXG4gICAgY2xhc3M6IGNsYXNzSGludCB8fCBcIkFNQlwiLFxuICAgIC8vIE9yaWdpbiBtYXJrZXIgaXNuJ3QgYSBjbGluaWNhbCBjbGFzcywgYnV0IHN0YXNoIGl0IGFzIHR5cGVfZGlzcGxheVxuICAgIC8vIHNvIGRvd25zdHJlYW0gc2VlcyB0aGUgTkhJIGxhYmVsIHdpdGhvdXQgdXMgaW52ZW50aW5nIG9uZS5cbiAgICB0eXBlX2Rpc3BsYXk6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gUGFzcyB0aHJvdWdoIGZvciB0aGUgZXZlbnR1YWwgSUhLRTMzMDNTMDIgZGV0YWlsIGZldGNoIChQaGFzZSBCKS5cbiAgICByb3dfaWQ6IGl0ZW0ucm9XX0lEIHx8IGl0ZW0ucm93X2lkIHx8IFwiXCIsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfaWQsIGhvc3BfYWJiciwgaG9zcF91cmwsIG9yaV90eXBlX25hbWUsIG9yaV90eXBlLCBmdW5jX2RhdGUsXG4vLyAgICBvdXRfZGF0ZSwgaWNkOWNtX2NvZGUsIGljZDljbV9jb2RlX2NuYW1lLCBvcF9jb2RlX2NuYW1lLCByb3dfaWR9XG4vLyBOb3RlOiBubyBwcm9jZWR1cmUgQ09ERSBpbiBsaXN0IFx1MjAxNCBvcF9jb2RlX2NuYW1lIGlzIHRoZSBvbmx5IGxhYmVsLlxuZnVuY3Rpb24gYWRhcHRQcm9jZWR1cmUoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5jX2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IGl0ZW0ucHJvQ19OQU1FIHx8IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiXG4gICk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIC8vIERpYWdub3NpcyAoaWNkOWNtX2NvZGVfY25hbWUpIGlzIHRoZSAqcmVhc29uKiBmb3IgdGhlIHByb2NlZHVyZSwgbm90XG4gIC8vIHRoZSBwcm9jZWR1cmUgY29kZSBpdHNlbGYuIFN0YXNoIGl0IGluIGBub3RlYCBzbyBpdCBzaG93cyB1cCBpbiB0aGVcbiAgLy8gRkhJUiByZXNvdXJjZSB3aXRob3V0IHBvbGx1dGluZyB0aGUgY29kZSBmaWVsZC5cbiAgY29uc3QgcmVhc29uQ29kZSA9IGl0ZW0uaWNkOWNtX2NvZGUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBcIlwiO1xuICBjb25zdCByZWFzb25OYW1lID0gcGlja0VuZ2xpc2goaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IFwiXCIpO1xuICBjb25zdCBub3RlID0gcmVhc29uTmFtZVxuICAgID8gKHJlYXNvbkNvZGUgPyBgUmVhc29uOiAke3JlYXNvbkNvZGV9ICR7cmVhc29uTmFtZX1gIDogYFJlYXNvbjogJHtyZWFzb25OYW1lfWApXG4gICAgOiBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIG5vdGUsXG4gICAgYm9keV9zaXRlOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfYWJiciB8fCBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwOFMwMSAoXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1IGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgcmVhbF9JTlNQRUNUX0RBVEUsIG9yZGVyX0NPREUsXG4vLyAgICBvcmRlcl9DT0RFXzJXb3JkLCBvcmRlcl9OQU1FLCBvcmlfVFlQRSwgcm93X0lELCBqcEdfU1RBVFVTLCAuLi59XG4vLyBObyBmaW5kaW5ncy9jb25jbHVzaW9uIFx1MjAxNCBsaXN0IGlzIG9yZGVyLWxldmVsIG9ubHkuIFdlIG1hcCB0byBQcm9jZWR1cmVcbi8vIChhbiBleGFtIHdhcyBwZXJmb3JtZWQpIHJhdGhlciB0aGFuIERpYWdub3N0aWNSZXBvcnQgKHdoaWNoIG5lZWRzIGFcbi8vIG5hcnJhdGl2ZSkuIElmL3doZW4gd2UgZmV0Y2ggdGhlIGFjdHVhbCByZXBvcnQgdGhpcyBiZWNvbWVzIGEgRFIuXG4vLyBJSEtFMzQwOFMwMiBkZXRhaWwgcHJvdmlkZXMgdGhlIGZ1bGwgcmFkaW9sb2d5IC8gZW5kb3Njb3B5IHJlcG9ydCBpblxuLy8gYGRlc2NgLiBDb21iaW5lZCB3aXRoIG9yZGVyX05BTUUgKyBmdW5jX0RBVEUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuZnVuY3Rpb24gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbChpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3JkZXJfTkFNRSB8fCBpdGVtLm9yZGVyX25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoaXRlbS5kZXNjIHx8IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5IHx8ICFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZXJfQ09ERSB8fCBpdGVtLm9yZGVyX2NvZGUgfHwgXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBjYXRlZ29yeTogXCJSQURcIixcbiAgICBjb25jbHVzaW9uLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE5ISSBzZXBhcmF0ZXMgdGhlIGV4YW0gZGF0ZSAoZnVuY19EQVRFKSBmcm9tIHRoZSByZXBvcnQtdXBsb2FkXG4gICAgLy8gdGltZXN0YW1wIChhc3NheV9VUExPQURfREFURSkuIFRoZSBsYXR0ZXIgaXMgd2hlbiB0aGUgcmVwb3J0XG4gICAgLy8gd2FzIGZpbmFsaXNlZCBpbiBOSEkncyBzeXN0ZW0gXHUyMDE0IG1hcHMgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4gICAgLy8gRmFsbHMgYmFjayB0byBOb25lIGlmIE5ISSBkaWRuJ3Qgc2hpcCBvbmUuXG4gICAgaXNzdWVkOiByb2NUb0lTTygoaXRlbS5hc3NheV9VUExPQURfREFURSB8fCBcIlwiKS5zcGxpdCgvXFxzKy8pWzBdKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRhcHREaWFnUmVwb3J0KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgZGlzcGxheSA9IGl0ZW0ub3JkZVJfTkFNRSB8fCBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLmV4YW1OYW1lIHx8IFwiXCI7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGNvbmNsdXNpb24gPVxuICAgIGl0ZW0ucmVwb3J0IHx8IGl0ZW0uZmluZGluZ1MgfHwgaXRlbS5pbVBfREFUQSB8fCBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgXCJcIjtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIGNhdGVnb3J5OiBcIlJBRFwiLFxuICAgIGNvbmNsdXNpb24sXG4gIH07XG59XG5cbi8vIHBhZ2VfdHlwZSBcdTIxOTIgYmFja2VuZCBwYWdlX3R5cGUgc3RyaW5nIHVzZWQgYnkgbWFwcGVycy5cbi8vIHBhdGggaXMgcmVsYXRpdmUgdG8gbmhpQmFzZS4gbWV0aG9kIGRlZmF1bHQgXCJHRVRcIi5cbi8vIGBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZWAgPSBlbmRwb2ludCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBpbiBcdTZDMTFcdTU3MEIgZm9ybWF0LlxuLy8gQ29uZmlybWVkIHZpYSBVUkxzIG9ic2VydmVkIGluIE5ISSdzIFNQQS4gT3RoZXIgZW5kcG9pbnRzIGVpdGhlciBkb24ndFxuLy8gYWNjZXB0IHJhbmdlIHBhcmFtcywgb3IgTkhJIHJlamVjdHMgdW5rbm93biBwYXJhbXMgXHUyMDE0IHdlIGxlYXZlIHRoZW0gYWxvbmVcbi8vICh0aGV5IGZhbGwgYmFjayB0byB0aGVpciBkZWZhdWx0IHdpbmRvdywgdHlwaWNhbGx5IDEtMiB5ZWFycykuXG5jb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiAoKSA9PiBudWxsLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuXTtcblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdikge1xuICBjb25zdCByYXcgPSB7XG4gICAgaWQ6IG92LmlkX25vLFxuICAgIGlkZW50aWZpZXI6IG92LmlkX25vLFxuICAgIG5hbWU6IG92Lm5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUpIHtcbiAgY29uc3QgcGF0aWVudCA9IF9idWlsZE92ZXJyaWRlUGF0aWVudChwYXRpZW50T3ZlcnJpZGUpO1xuICBjb25zdCBwaWQgPSBwYXRpZW50LmlkO1xuICBjb25zdCBhbGwgPSBbcGF0aWVudF07XG5cbiAgZm9yIChjb25zdCBwdCBvZiBfTE9DQUxfUEFHRV9UWVBFX09SREVSKSB7XG4gICAgY29uc3QgaXRlbXMgPSBieVR5cGVbcHRdO1xuICAgIGlmICghaXRlbXMgfHwgaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBsZXQgbWFwcGVkO1xuICAgIGlmIChHUk9VUF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIG1hcHBlZCA9IEdST1VQX0hBTkRMRVJTW3B0XShpdGVtcywgcGlkKTtcbiAgICB9IGVsc2UgaWYgKExJU1RfSEFORExFUlNbcHRdKSB7XG4gICAgICBjb25zdCBbZm5dID0gTElTVF9IQU5ETEVSU1twdF07XG4gICAgICBtYXBwZWQgPSBpdGVtc1xuICAgICAgICAuZmlsdGVyKChpdCkgPT4gaXQgJiYgdHlwZW9mIGl0ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAubWFwKChpdCkgPT4gZm4oaXQsIHBpZCkpXG4gICAgICAgIC5maWx0ZXIoKHIpID0+IHIgIT09IG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHB0ID09PSBcImVuY291bnRlcnNcIikgbWFwcGVkID0gZGVkdXBBZG1pc3Npb25EYXlBbWIobWFwcGVkKTtcbiAgICBhbGwucHVzaCguLi5tYXBwZWQpO1xuICB9XG5cbiAgLy8gRGVkdXAgYnkgKHJlc291cmNlVHlwZSwgaWQpIGJlZm9yZSBhc3NlbWJsaW5nIHRoZSBCdW5kbGUuIE11bHRpcGxlXG4gIC8vIE5ISSBlbmRwb2ludHMgY2FuIGZlZWQgdGhlIHNhbWUgcGFnZV90eXBlIChlLmcuIGVuY291bnRlcnMgL1xuICAvLyBpbnBhdGllbnQgLyBpbnBhdGllbnRfbGVnYWN5IGFsbCBcdTIxOTIgcGFnZV90eXBlPVwiZW5jb3VudGVyc1wiKSwgYW5kIHRoZVxuICAvLyBtYXBwZXIgcHJvZHVjZXMgZGV0ZXJtaW5pc3RpYyBzdGFibGUgSURzIFx1MjAxNCBzbyB0d28gcmF3IGl0ZW1zIHRoYXRcbiAgLy8gZGVzY3JpYmUgdGhlIHNhbWUgbWVkaWNhbCBldmVudCBjb2xsYXBzZSB0byBvbmUgcmVzb3VyY2UuIEJhY2tlbmRcbiAgLy8gdXBzZXJ0IGhhbmRsZXMgdGhpcyBhdXRvbWF0aWNhbGx5IChzYW1lIHN0YWJsZSBJRCA9IHNhbWUgREIgcm93KTtcbiAgLy8gbG9jYWwgbW9kZSBoYXMgdG8gZG8gaXQgZXhwbGljaXRseS4gV2l0aG91dCB0aGlzIGRlZHVwLCB0aGUgbG9jYWxcbiAgLy8gQnVuZGxlIGVuZHMgdXAgaW5mbGF0ZWQgcmVsYXRpdmUgdG8gd2hhdCBiYWNrZW5kIHN0b3JlcyBmcm9tIHRoZVxuICAvLyBpZGVudGljYWwgTkhJIGlucHV0LlxuICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICBjb25zdCB1bmlxdWUgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIGFsbCkge1xuICAgIGNvbnN0IGtleSA9IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YDtcbiAgICBpZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgc2Vlbi5hZGQoa2V5KTtcbiAgICB1bmlxdWUucHVzaChyKTtcbiAgfVxuXG4gIC8vIExpbmtlciArIHNleC1zdHJhdGlmaWVkIHJlc29sdmVyIHJ1biBvbmNlIG92ZXIgdGhlIGZ1bGwgYXNzZW1ibGVkXG4gIC8vIGxpc3QgKHNhbWUgcGlwZWxpbmUgYmFja2VuZCdzIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkIHJ1bnMsIGp1c3RcbiAgLy8gYWdhaW5zdCBhbiBpbi1tZW1vcnkgY2FuZGlkYXRlIGFycmF5IGluc3RlYWQgb2YgYSBTUUxpdGUgcXVlcnkpLlxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKHVuaXF1ZSwgdW5pcXVlKTtcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMocGF0aWVudCwgdW5pcXVlKTtcblxuICByZXR1cm4ge1xuICAgIHJlc291cmNlVHlwZTogXCJCdW5kbGVcIixcbiAgICB0eXBlOiBcImNvbGxlY3Rpb25cIixcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCBcIlpcIiksXG4gICAgZW50cnk6IHVuaXF1ZS5tYXAoKHIpID0+ICh7XG4gICAgICBmdWxsVXJsOiBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWAsXG4gICAgICByZXNvdXJjZTogcixcbiAgICB9KSksXG4gIH07XG59XG5cbi8vIExvY2FsIG1vZGUgc3Rhc2hlcyB0aGUgYXNzZW1ibGVkIEJ1bmRsZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlclxuLy8gYSBzaW5nbGUgXCJwZW5kaW5nRmhpckJ1bmRsZVwiIHNsb3QuIFRoZSBwb3B1cCBzaG93cyBhIGRvd25sb2FkIGJ1dHRvblxuLy8gd2hlbiB0aGlzIHNsb3QgaXMgbm9uLWVtcHR5OyB0aGUgYWN0dWFsIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgY2FsbFxuLy8gaGFwcGVucyBmcm9tIHRoZSBwb3B1cCAoaW4gcmVzcG9uc2UgdG8gYSB1c2VyIGNsaWNrKSBzbyB0aGUgZmlsZVxuLy8gZG9lc24ndCBhcHBlYXIgaW4gdGhlIERvd25sb2FkcyBiYXIgdW5pbnZpdGVkLlxuLy9cbi8vIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRJZCkge1xuICAvLyBGaWxlbmFtZSBwZXIgc3BlYzogbmhpLXtwYXRpZW50X2lkfS17WVlZWU1NREQtSEhNTX0uanNvblxuICAvLyB0b0lTT1N0cmluZygpIHJldHVybnMgVVRDOyB1c2VyIGV4cGVjdHMgbG9jYWwtY2xvY2sgdGltZSBvbiBkaXNrLlxuICAvLyBCdWlsZCB0aGUgc3RhbXAgZnJvbSBsb2NhbC10aW1lIGNvbXBvbmVudHMgaW5zdGVhZC5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIGNvbnN0IHRzID1cbiAgICBgJHtub3cuZ2V0RnVsbFllYXIoKX0ke3BhZChub3cuZ2V0TW9udGgoKSArIDEpfSR7cGFkKG5vdy5nZXREYXRlKCkpfWAgK1xuICAgIGAtJHtwYWQobm93LmdldEhvdXJzKCkpfSR7cGFkKG5vdy5nZXRNaW51dGVzKCkpfWA7XG4gIGNvbnN0IHNhZmVQaWQgPSAocGF0aWVudElkIHx8IFwidW5rbm93blwiKS5yZXBsYWNlKC9bXkEtWmEtejAtOV8tXS9nLCBcIl9cIik7XG4gIGNvbnN0IGZpbGVuYW1lID0gYG5oaS0ke3NhZmVQaWR9LSR7dHN9Lmpzb25gO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoYnVuZGxlLCBudWxsLCAyKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBbUEVORElOR19CVU5ETEVfS0VZXToge1xuICAgICAgZmlsZW5hbWUsXG4gICAgICBqc29uLFxuICAgICAgYnl0ZXM6IGpzb24ubGVuZ3RoLFxuICAgICAgZ2VuZXJhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICBwYXRpZW50SWQ6IHBhdGllbnRJZCB8fCBudWxsLFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4geyBmaWxlbmFtZSwgYnl0ZXM6IGpzb24ubGVuZ3RoIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bk5oaUFwaVN5bmMoeyB0YWJJZCwgbW9kZSwgYmFja2VuZCwgc3luY0FwaUtleSwgbmhpQmFzZSwgcGF0aWVudE92ZXJyaWRlLCBkYXRlUmFuZ2UsIGRhdGVSYW5nZUxhYmVsIH0pIHtcbiAgX2NhbmNlbGxlZCA9IGZhbHNlO1xuICBjb25zdCBCQVNFID0gbmhpQmFzZSB8fCBgaHR0cHM6Ly8ke05ISV9IT1NUfWA7XG5cbiAgaWYgKCFwYXRpZW50T3ZlcnJpZGUgfHwgIXBhdGllbnRPdmVycmlkZS5pZF9ubykge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1RkYwOFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1Rlx1RkYwOVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBTaWRlYmFyIGlmcmFtZSAobWVkaWNhbC1ub3RlIFNNQVJUIGFwcCkgY29tcGV0ZXMgd2l0aCBOSEkgZmFuLW91dFxuICAvLyBmZXRjaGVzIGZvciB0aGUgdGFiJ3MgbmV0d29yayArIEpTIHRocmVhZC4gRXZlbiBpbiBkaXNwbGF5Om5vbmUgaXRcbiAgLy8gY2FuIHRha2UgMTAwLTIwMG1zIHBlciByZXF1ZXN0LiBUZWxsIHNpZGViYXIuanMgdG8gc3VzcGVuZCB0aGVcbiAgLy8gaWZyYW1lIChzZXQgc3JjPWFib3V0OmJsYW5rKSBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBzeW5jLlxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jUnVubmluZzogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgLy8gV2FsbC1jbG9jayBzdGFydCB0aW1lIFx1MjAxNCB1c2VkIHRvIGNvbXB1dGUgZWxhcHNlZCBzZWNvbmRzIGZvciB0aGVcbiAgLy8gZmluYWwgc3RhdHVzIGxpbmUgKFwiXHU3RTNEXHU4MDE3XHU2NjQyIDEyLjMgXHU3OUQyXCIpLiBTdGFzaCBvbiBhIGxvY2FsIHNvIHdlIGNhblxuICAvLyByZWFjaCBpdCBmcm9tIHRoZSBjb21wbGV0aW9uIG1lc3NhZ2UgYXQgdGhlIHZlcnkgZW5kLlxuICBjb25zdCBfdDAgPSBEYXRlLm5vdygpO1xuICAvLyBQZXItcGhhc2UgdGltaW5ncywgc3VyZmFjZWQgaW50byB0aGUgcG9wdXAncyBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiBzZWUgZXhhY3RseSB3aGVyZSB0aW1lIGlzIGdvaW5nLiBFYWNoIGVudHJ5OiB7IG5hbWUsIG1zIH0uXG4gIGNvbnN0IF9waGFzZXMgPSBbXTtcbiAgbGV0IF9waGFzZVN0YXJ0ID0gX3QwO1xuICBjb25zdCBfbWFya1BoYXNlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIF9waGFzZXMucHVzaCh7IG5hbWUsIG1zOiBub3cgLSBfcGhhc2VTdGFydCB9KTtcbiAgICBfcGhhc2VTdGFydCA9IG5vdztcbiAgfTtcbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiB0cnVlLCBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1NDBDXHU2QjY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHBoYXNlOiBcImluaXRcIixcbiAgICBzdGFydGVkOiBfdDAsIHRvdGFsUmVzb3VyY2VzOiAwLCBob3N0OiBOSElfSE9TVCwgZXJyb3JzOiBbXSxcbiAgfSk7XG5cbiAgLy8gU3RlcCAxOiBmZXRjaCBhbGwgZW5kcG9pbnRzIGluIFBBUkFMTEVMIGluc2lkZSB0aGUgTkhJIHRhYi4gUnVubmluZyBpblxuICAvLyB0YWIgY29udGV4dCBtZWFucyBzYW1lLW9yaWdpbiBjb29raWVzIGFyZSBzZW50IGF1dG9tYXRpY2FsbHkgXHUyMDE0IGZldGNoXG4gIC8vIGZyb20gdGhlIFNXIHdvdWxkIGJlIGNyb3NzLW9yaWdpbiBhbmQgU2FtZVNpdGUgYmxvY2tzIHRoZSBzZXNzaW9uXG4gIC8vIGNvb2tpZSwgaGVuY2Ugd2UgZ290IFwic2Vzc2lvbiBleHBpcmVkXCIgZXZlbiB3aGVuIGxvZ2dlZCBpbi5cbiAgLy8gUGFzcyBvbmx5IHNlcmlhbGlzYWJsZSBkYXRhIChwYXRocywgbWV0aG9kLCBuYW1lKTsgYWRhcHRlcnMgc3RheSBpbiBTVy5cbiAgLy8gSW5qZWN0IElTTy1kYXRlIHJhbmdlIGludG8gZWFjaCBlbmRwb2ludCB0aGF0IHN1cHBvcnRzIGl0IChjb252ZXJ0c1xuICAvLyB0byBcdTZDMTFcdTU3MEIgZm9ybWF0IHZpYSBpc29Ub1JPQykuIFNraXBwZWQgZW5kcG9pbnRzIGtlZXAgdGhlaXIgZGVmYXVsdFxuICAvLyBOSEktc2lkZSB3aW5kb3cgKDEtMiB5ZWFycyBkZXBlbmRpbmcgb24gdGhlIHBhZ2UpLlxuICBjb25zdCBmZXRjaFNwZWMgPSBOSElfQVBJX0VORFBPSU5UUy5tYXAoKGVwKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IGVwLnN1cHBvcnRzRGF0ZVJhbmdlID8gYXBwbHlEYXRlUmFuZ2VUb1BhdGgoZXAucGF0aCwgZGF0ZVJhbmdlKSA6IGVwLnBhdGg7XG4gICAgcmV0dXJuIHsgbmFtZTogZXAubmFtZSwgdXJsOiBCQVNFICsgcGF0aCwgbWV0aG9kOiBcIkdFVFwiIH07XG4gIH0pO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIltOSEkgQVBJIHN5bmNdIGRhdGUgcmFuZ2U6XCIsXG4gICAgICBgJHtkYXRlUmFuZ2Uuc3RhcnQgfHwgXCIodW5ib3VuZGVkKVwifSBcdTIxOTIgJHtkYXRlUmFuZ2UuZW5kIHx8IFwiKHVuYm91bmRlZClcIn1gKTtcbiAgfVxuXG4gIGxldCBzZXR0bGVkUmF3O1xuICB0cnkge1xuICAgIFt7IHJlc3VsdDogc2V0dGxlZFJhdyB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jIChzcGVjcykgPT4ge1xuICAgICAgICAvLyBOSEkgYXV0aDogY29va2llcyArIEpXVCBpbiBzZXNzaW9uU3RvcmFnZS4gVGhlIFNQQSdzIGF4aW9zIHNldHNcbiAgICAgICAgLy8gYEF1dGhvcml6YXRpb246IEJlYXJlciA8dG9rZW4+YCBvbiBldmVyeSBBUEkgY2FsbC4gU2Vzc2lvblxuICAgICAgICAvLyBjb29raWVzIGFsb25lIHJldHVybiA0MDEuXG4gICAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXRva2VuKSByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcblxuICAgICAgICAvLyBEZXRlY3QgSURMRS90aW1lb3V0IHBhZ2UgYWxyZWFkeSByZWRpcmVjdGVkIG9uIHRoaXMgdGFiLlxuICAgICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNjAtc2Vjb25kIHRpbWVvdXQgcGVyIGZldGNoIFx1MjAxNCBzb21lIE5ISSBlbmRwb2ludHMgKGVuY291bnRlcnMsXG4gICAgICAgIC8vIG1lZHMpIHRha2UgMjArIHNlY29uZHMuXG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHMsIG1zKSB7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIG1zKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHMudXJsLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogcy5tZXRob2QsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICAgIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgY29uc3QgY3QgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgICBpZiAoIWN0LmluY2x1ZGVzKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgbm9uLUpTT04gKGN0PSR7Y3R9KWAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib2R5O1xuICAgICAgICAgICAgdHJ5IHsgYm9keSA9IGF3YWl0IHIuanNvbigpOyB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIkpTT04gcGFyc2U6IFwiICsgZS5tZXNzYWdlIH07IH1cbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBpZiAoZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIikgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJ0aW1lb3V0IDYwc1wiIH07XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbmN1cnJlbmN5LWxpbWl0ZWQgZXhlY3V0aW9uOiBtYXggMyBpbiBmbGlnaHQgYXQgb25jZS4gTkhJJ3NcbiAgICAgICAgLy8gYWJ1c2UgZGV0ZWN0aW9uIGJsb2NrcyBidXJzdHM7IHdpdGggMTEgcGFyYWxsZWwgZmV0Y2hlcyBpdFxuICAgICAgICAvLyB0aHJvdHRsZWQgdGhlIHNlc3Npb24gYW5kIHJlZGlyZWN0ZWQgdG8gSUhLRTMwMDFTOTlfSURMRS5cbiAgICAgICAgLy8gMyBhdCBhIHRpbWUgKyAyMDBtcyBqaXR0ZXIgaXMgZ2VudGxlIGVub3VnaCBmb3IgMS1zaG90IHN5bmMuXG4gICAgICAgIGNvbnN0IENPTkNVUlJFTkNZID0gMztcbiAgICAgICAgY29uc3QgSklUVEVSX01TID0gMjAwO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gbmV3IEFycmF5KHNwZWNzLmxlbmd0aCk7XG4gICAgICAgIGxldCBuZXh0SWR4ID0gMDtcbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICAgIHdoaWxlIChuZXh0SWR4IDwgc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gbmV4dElkeCsrO1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiBKSVRURVJfTVMpKTtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBhd2FpdCBmZXRjaE9uZShzcGVjc1tpXSwgNjAwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JrZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQ1VSUkVOQ1kgJiYgdyA8IHNwZWNzLmxlbmd0aDsgdysrKSB7XG4gICAgICAgICAgd29ya2Vycy5wdXNoKHdvcmtlcigpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh3b3JrZXJzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgICAgYXJnczogW2ZldGNoU3BlY10sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGV4ZWN1dGVTY3JpcHQgZmFpbGVkOiAke2UubWVzc2FnZX1gKTtcbiAgfVxuXG4gIC8vIERldGVjdCBzZXNzaW9uIGV4cGlyZWQgYWNyb3NzIHJlc3VsdHMuXG4gIGlmIChzZXR0bGVkUmF3LnNvbWUoKHIpID0+IHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIH1cblxuICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAvLyBHZW5lcmljIGxpc3QgZXh0cmFjdGlvbjogaGFuZGxlcyBhbGwgb2JzZXJ2ZWQgTkhJIHNoYXBlcy5cbiAgLy8gICAtIFBsYWluIGFycmF5IChJSEtFMzQwOSBsYWIpXG4gIC8vICAgLSB7c3BfSUhLRTxYPl9kYXRhOiBbLi4uXX0gIChtZWRpY2F0aW9ucywgYWxsZXJnaWVzKVxuICAvLyAgIC0ge3dlc3Rlcm5fZGF0YSwgY2hpbmVzZV9kYXRhLCBkZW50aXN0X2RhdGE6IFsuLi5dfSAoZW5jb3VudGVyIGxpc3QsXG4gIC8vICAgICBzcGxpdCBieSBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQiBcdTIwMTQgd2Ugd2FudCBhbGwgdGhyZWUpXG4gIC8vIEZvciBtdWx0aS1hcnJheSBzaGFwZXMgd2UgbWVyZ2UgYWxsIGFycmF5cyBhbmQgdGFnIGVhY2ggaXRlbSB3aXRoXG4gIC8vIGBfX3NlY3Rpb25gICh0aGUgc291cmNlIGtleSkgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgZnVuY3Rpb24gZXh0cmFjdExpc3QoYm9keSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkpKSByZXR1cm4gYm9keTtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgIT09IFwib2JqZWN0XCIpIHJldHVybiBbXTtcbiAgICBsZXQgYXJyYXlLZXlzID0gT2JqZWN0LmVudHJpZXMoYm9keSkuZmlsdGVyKChbXywgdl0pID0+IEFycmF5LmlzQXJyYXkodikpO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBhcnJheUtleXNbMF1bMV07XG4gICAgLy8gTXVsdGlwbGUgYXJyYXlzIFx1MjAxNCBkcm9wIFVJLWhlbHBlciBhcnJheXMgKGRyb3Bkb3duIG9wdGlvbnMsIHNvcnRcbiAgICAvLyBzZWxlY3RvcnMsIGxvb2t1cCB0YWJsZXMpLiBOSEkgbWl4ZXMgdGhlbSBpbnRvIHRoZSBzYW1lIHJlc3BvbnNlXG4gICAgLy8gKGUuZy4gaW1hZ2luZyByZXR1cm5zIHNwX0lIS0UzNDA4UzAxX2RhdGEgKyBpY2Q5Y21fc2VsZWN0KS5cbiAgICBjb25zdCBIRUxQRVJfUkUgPSAvc2VsZWN0fG9wdGlvbnxkcm9wZG93bnxmaWx0ZXJ8c29ydHxsb29rdXAvaTtcbiAgICBjb25zdCBkYXRhS2V5cyA9IGFycmF5S2V5cy5maWx0ZXIoKFtrXSkgPT4gIUhFTFBFUl9SRS50ZXN0KGspKTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gZGF0YUtleXNbMF1bMV07XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTsgLy8gZmFsbGJhY2tcbiAgICBhcnJheUtleXMgPSBkYXRhS2V5cztcbiAgICAvLyBNdWx0aXBsZSBkYXRhIGFycmF5cyAoZS5nLiB3ZXN0ZXJuX2RhdGEvY2hpbmVzZV9kYXRhL2RlbnRpc3RfZGF0YSlcbiAgICAvLyBcdTIwMTQgbWVyZ2Ugd2l0aCBfX3NlY3Rpb24gdGFnIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgYXJyYXlLZXlzKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygdikge1xuICAgICAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4uaXRlbSwgX19zZWN0aW9uOiBrIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cblxuICAvLyBBcHBseSBTVy1zaWRlIGFkYXB0ZXJzIHRvIGVhY2ggZW5kcG9pbnQncyBib2R5LlxuICBjb25zdCBzZXR0bGVkID0gc2V0dGxlZFJhdy5tYXAoKHIsIGkpID0+IHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGlmIChyLmVycm9yKSB7XG4gICAgICByZXR1cm4geyBzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29uOiB7IG1lc3NhZ2U6IGAke2VwLm5hbWV9OiAke3IuZXJyb3J9YCB9IH07XG4gICAgfVxuICAgIGNvbnN0IGxpc3QgPSBleHRyYWN0TGlzdChyLmJvZHkpO1xuICAgIC8vIEFkYXB0ZXJzIHJldHVybiBlaXRoZXI6XG4gICAgLy8gICAtIG9uZSBpdGVtICAgKG1vc3QgYWRhcHRlcnMgXHUyMDE0IGxhYnMsIG1lZHMsIGVuY291bnRlcnMsIGltYWdpbmcpXG4gICAgLy8gICAtIG51bGwvdW5kZWZpbmVkIChza2lwKVxuICAgIC8vICAgLSBhcnJheSBvZiBpdGVtcyAoYWRhcHRBZHVsdFByZXZlbnRpdmUgXHUyMDE0IHVuZm9sZHMgb25lIHNjcmVlbmluZ1xuICAgIC8vICAgICByb3cgaW50byB+MTUgT2JzZXJ2YXRpb24gZW50cmllcylcbiAgICAvLyBGbGF0LWhhbmRsZSBib3RoIHNoYXBlcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIHBpY2sgd2hhdGV2ZXIncyBjbGVhcmVzdC5cbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaXQgb2YgbGlzdCkge1xuICAgICAgY29uc3QgciA9IGVwLmFkYXB0KGl0KTtcbiAgICAgIGlmIChyID09PSBudWxsIHx8IHIgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgcikgaWYgKHgpIGl0ZW1zLnB1c2goeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtcy5wdXNoKHIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTbmFwc2hvdCBhIGJvZHkgc2FtcGxlIGZvciBzaGFwZXMgd2hlcmUgYWRhcHRlciByZWplY3RlZCBldmVyeXRoaW5nXG4gICAgLy8gXHUyMDE0IHVzZWQgYnkgdGhlIGRpYWdub3N0aWMgYnJlYWtkb3duIGluIHN0ZXAgMi5cbiAgICBsZXQgYm9keVNhbXBsZSA9IG51bGw7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEluY2x1ZGUgdGhlIEZJUlNUIElURU0gKGZ1bGwga2V5cyt2YWx1ZXMpIHNvIHdlIGNhbiBidWlsZCB0aGVcbiAgICAgIC8vIGNvcnJlY3QgYWRhcHRlciB3aXRob3V0IGFub3RoZXIgcm91bmQtdHJpcC4gTkhJIGl0ZW1zIG1heSBpbmNsdWRlXG4gICAgICAvLyBQSUk7IHRoZSB1c2VyIGluc3BlY3RzIHRoaXMgbG9jYWxseSB2aWEgc2VydmljZS13b3JrZXIgZGV2dG9vbHMuXG4gICAgICBib2R5U2FtcGxlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0b3BMZXZlbEtleXM6IEFycmF5LmlzQXJyYXkoci5ib2R5KSA/IG51bGwgOiBPYmplY3Qua2V5cyhyLmJvZHkgfHwge30pLnNsaWNlKDAsIDEwKSxcbiAgICAgICAgd2FzQXJyYXk6IEFycmF5LmlzQXJyYXkoci5ib2R5KSxcbiAgICAgICAgZmlyc3RJdGVtOiBsaXN0WzBdID8/IG51bGwsXG4gICAgICAgIHNlY29uZEl0ZW06IGxpc3RbMV0gPz8gbnVsbCxcbiAgICAgIH0pLnNsaWNlKDAsIDQwMDApO1xuICAgIH1cbiAgICByZXR1cm4geyBzdGF0dXM6IFwiZnVsZmlsbGVkXCIsIHZhbHVlOiB7IGVwLCBpdGVtcywgcmF3X2NvdW50OiBsaXN0Lmxlbmd0aCwgYm9keVNhbXBsZSwgcmF3TGlzdDogbGlzdCB9IH07XG4gIH0pO1xuXG4gIF9tYXJrUGhhc2UoXCJuaGktcGFyYWxsZWxcIik7XG5cbiAgLy8gU3RlcCAxYTogZW5jb3VudGVyIGRldGFpbCBmYW4tb3V0IChJSEtFMzMwM1MwMikgXHUyMTkyIGNsYXNzaWZ5IGVhY2hcbiAgLy8gSUhLRTMzMDNTMDEgdmlzaXQgYXMgQU1CIC8gRU1FUiAvIElNUCB2aWEgaG9zcF9EQVRBX1RZUEVfTkFNRS5cbiAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBcdTYwMjVcdThBM0EgZGlzdGluY3Rpb247IGRldGFpbCBkb2VzLiBXZSByZS1cbiAgLy8gYWRhcHQgZWFjaCBlbmNvdW50ZXIgaXRlbSB3aXRoIHRoZSBkaXNjb3ZlcmVkIGNsYXNzIGJlZm9yZSB0aGVcbiAgLy8gYmFja2VuZCB1cGxvYWQgc3RlcC5cbiAgY29uc3QgZW5jSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiZW5jb3VudGVyc1wiKTtcbiAgaWYgKGVuY0lkeCA+PSAwICYmIHNldHRsZWRbZW5jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRldGFpbE1hcCA9IGF3YWl0IF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlLWFkYXB0IHdpdGggY2xhc3NIaW50IGZyb20gZGV0YWlsOyBmYWxsIGJhY2sgdG8gQU1CLlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSh2aXNpdHNbaV0sIGNscyk7XG4gICAgICAgICAgaWYgKGl0KSByZUFkYXB0ZWQucHVzaChpdCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLml0ZW1zID0gcmVBZGFwdGVkO1xuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVBZGFwdGVkLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGVuY291bnRlciBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiZW5jb3VudGVyLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDFiOiBtZWRpY2F0aW9ucyBuZWVkIGEgMi1zdGVwIGZldGNoIFx1MjAxNCBJSEtFMzMwNlMwMSBvbmx5IHJldHVybnNcbiAgLy8gdmlzaXQgbWV0YWRhdGEgKGRhdGUsIElDRCwgaG9zcGl0YWwpLCBubyBkcnVnIG5hbWVzLiBEcnVncyBsaXZlIGF0XG4gIC8vIElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIgdW5kZXJcbiAgLy8gaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC4gRmFuIG91dCBkZXRhaWxcbiAgLy8gZmV0Y2hlcyBpbnNpZGUgdGhlIHNhbWUgdGFiIGNvbnRleHQgKGNvb2tpZXMgKyBKV1QpLCBrZWVwaW5nXG4gIC8vIGNvbmN1cnJlbmN5IGxpbWl0ZWQgc28gTkhJIGRvZXNuJ3QgSURMRS1yZWRpcmVjdCB1cy5cbiAgLy8gU3RlcCAxYzogaW1hZ2luZyBuZWVkcyBJSEtFMzQwOFMwMiBmb3IgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlLlxuICAvLyBMaXN0IGVuZHBvaW50IG9ubHkgaGFzIG9yZGVyIG1ldGFkYXRhOyBjdHlwZSBwYXJhbSBtaXJyb3JzIHRoZVxuICAvLyB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG4gIGNvbnN0IGltZ0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImltYWdpbmdcIik7XG4gIGlmIChpbWdJZHggPj0gMCAmJiBzZXR0bGVkW2ltZ0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcdTU4MzFcdTU0NEFcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXBvcnRzID0gYXdhaXQgX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5pdGVtcyA9IHJlcG9ydHM7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZXBvcnRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW1hZ2luZyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiaW1hZ2luZy1kZXRhaWxcIik7XG5cbiAgY29uc3QgbWVkSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwibWVkaWNhdGlvbnNcIik7XG4gIGlmIChtZWRJZHggPj0gMCAmJiBzZXR0bGVkW21lZElkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBpZiAocy5zdGF0dXMgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgZXJyb3JzLnB1c2goYCR7ZXAubmFtZX06ICR7cy5yZWFzb24ubWVzc2FnZX1gKTtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2VwLm5hbWV9PUVSUmApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHsgaXRlbXMsIHJhd19jb3VudCB9ID0gcy52YWx1ZTtcbiAgICByYXdfdG90YWwgKz0gcmF3X2NvdW50O1xuICAgIGFkYXB0ZWRfdG90YWwgKz0gaXRlbXMubGVuZ3RoO1xuICAgIC8vIEZvcm1hdDogYWRhcHRlZF9pdGVtcy9yYXdfTkhJX3Jvd3MuIEZvciBtb3N0IGVuZHBvaW50cyB0aGUgcmF0aW9cbiAgICAvLyBpcyAxOjEgKG9uZSBOSEkgcm93IFx1MjE5MiBvbmUgRkhJUiBpdGVtKSBzbyBcIjUvNVwiIHJlYWRzIG5hdHVyYWxseS5cbiAgICAvLyBGb3IgMS10by1tYW55IGFkYXB0ZXJzIChlLmcuIGFkdWx0X3ByZXZlbnRpdmUgdW5mb2xkcyBvbmVcbiAgICAvLyBzY3JlZW5pbmcgcm93IGludG8gfjE4IE9ic2VydmF0aW9ucyksIHByZWZpeCB0aGUgcmF3IHNpZGUgd2l0aFxuICAgIC8vIGl0cyBub3VuIHNvIHVzZXJzIGRvbid0IHJlYWQgXCIzNi8yXCIgYXMgXCIzNiBvZiAyIGV4cGVjdGVkXCIuXG4gICAgbGV0IGxhYmVsO1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgbGFiZWwgPSBgJHtlcC5uYW1lfT0ke3Jhd19jb3VudH0gcm93cyBcdTIxOTIgJHtpdGVtcy5sZW5ndGh9IG9ic2A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhYmVsID0gYCR7ZXAubmFtZX09JHtpdGVtcy5sZW5ndGh9LyR7cmF3X2NvdW50fWA7XG4gICAgfVxuICAgIGJyZWFrZG93bi5wdXNoKGxhYmVsKTtcbiAgICAvLyBTYXZlIGJvZHkgc2FtcGxlIGZvciBmaXJzdCBlbmRwb2ludCB3aXRoIHJhdz4wIGJ1dCBhZGFwdGVkPTAgKGFkYXB0ZXJcbiAgICAvLyBtaXNtYXRjaCkgc28gd2UgY2FuIGl0ZXJhdGUuIFN0b3JlZCB1bmRlciBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3JcbiAgICAvLyBpbnNwZWN0aW9uIHZpYSBzZXJ2aWNlIHdvcmtlciBEZXZUb29scy5cbiAgICBpZiAocmF3X2NvdW50ID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgW2BfX3NhbXBsZUJvZHlfJHtlcC5uYW1lfWBdOiBzLnZhbHVlLmJvZHlTYW1wbGUgfHwgXCJuL2FcIixcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIChieVR5cGVbZXAucGFnZV90eXBlXSA9IGJ5VHlwZVtlcC5wYWdlX3R5cGVdIHx8IFtdKS5wdXNoKC4uLml0ZW1zKTtcbiAgfVxuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGxldCBfbG9jYWxGaWxlbmFtZSA9IG51bGw7XG4gIGlmIChtb2RlID09PSBcImxvY2FsXCIpIHtcbiAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNFXHVEREVDIFx1OEY0OVx1NjNEQlx1NzBCQSBGSElSIEJ1bmRsZVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogMCB9KTtcbiAgICBsZXQgYnVuZGxlO1xuICAgIHRyeSB7XG4gICAgICBidW5kbGUgPSBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JzLnB1c2goYGxvY2FsIG1hcHBpbmc6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgYnVuZGxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1bmRsZSkge1xuICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDQkUgXHU2RTk2XHU1MDk5ICR7dG90YWx9IFx1N0I0NiBGSElSIFx1OENDN1x1NkU5MFx1MjAyNmAsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubyk7XG4gICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBzdGFzaCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IFtwYWdlX3R5cGUsIGl0ZW1zXSBvZiBPYmplY3QuZW50cmllcyhieVR5cGUpKSB7XG4gICAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1MkIwNlx1RkUwRiBcdTRFMEFcdTUwQjMgJHtwYWdlX3R5cGV9XHVGRjA4JHtpdGVtcy5sZW5ndGh9IFx1N0I0Nlx1RkYwOVx1MjAyNmAsXG4gICAgICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCBwYXRpZW50T3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIGlmIChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRFx1RENFNiBcdTUzRDZcdTVGOTdcdTVGOENcdTdBRUZcdTVCOENcdTY1NzQgQnVuZGxlXHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgICAgY29uc3QgZXhwVXJsID0gYCR7YmFja2VuZH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pfWA7XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChleHBVcmwsIHtcbiAgICAgICAgICBoZWFkZXJzOiBzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHIub2spIHtcbiAgICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8pO1xuICAgICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICAgICAgLy8gQWxpZ24gcmVwb3J0ZWQgY291bnQgd2l0aCBsb2NhbCBtb2RlOiBidW5kbGUuZW50cnkubGVuZ3RoXG4gICAgICAgICAgLy8gaW5jbHVkZXMgdGhlIFBhdGllbnQgcmVzb3VyY2UgKHdoaWNoIHRoZSBwZXItcGFnZS10eXBlIFBPU1RcbiAgICAgICAgICAvLyBjb3VudHMgaGFkIHByZXZpb3VzbHkgb21pdHRlZCBiZWNhdXNlIFBhdGllbnQgaXMgYXV0by1jcmVhdGVkXG4gICAgICAgICAgLy8gc2lsZW50bHkgZnJvbSBwYXRpZW50X292ZXJyaWRlKS4gU2FtZSBkYXRhIFx1MjE5MiBzYW1lIG51bWJlci5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpKSB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6IEhUVFAgJHtyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UobW9kZSA9PT0gXCJsb2NhbFwiID8gXCJhc3NlbWJsZStzdGFzaFwiIDogXCJiYWNrZW5kLXVwbG9hZFwiKTtcblxuICAvLyBGb3JtYXQgZWxhcHNlZCB3YWxsLWNsb2NrIHRpbWU6IHNlY29uZHMgKDEgZHApIGZvciBzaG9ydCBzeW5jcyxcbiAgLy8gXCJtbTpzc1wiIG9uY2Ugd2UgY3Jvc3MgdGhlIG1pbnV0ZSBtYXJrIHNvIHRoZSBwb3B1cCBzdGF0dXMgc3RheXMgcmVhZGFibGUuXG4gIGNvbnN0IF9lbGFwc2VkTXMgPSBEYXRlLm5vdygpIC0gX3QwO1xuICBjb25zdCBfZWxhcHNlZFN0ciA9IF9lbGFwc2VkTXMgPCA2MF8wMDBcbiAgICA/IGAkeyhfZWxhcHNlZE1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYFxuICAgIDogYCR7TWF0aC5mbG9vcihfZWxhcHNlZE1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChfZWxhcHNlZE1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xuICAvLyBObyBtb3JlIFwiXHU2QTk0XHU2ODQ4XHU1REYyXHU1MDk5XHU1OUE1XHUyMDI2XCIgdGFpbCBcdTIwMTQgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidXR0b24gc2l0cyByaWdodFxuICAvLyBiZWxvdyB0aGUgc3RhdHVzLCBzbyBzYXlpbmcgXCJcdTlFREVcdTRFMEJcdTY1QjlcdTYzMDlcdTkyMTVcIiBpcyBqdXN0IG5vaXNlLlxuICBjb25zdCBfbG9jYWxUYWlsID0gXCJcIjtcbiAgY29uc3QgX3N1Y2Nlc3NWZXJiID0gbW9kZSA9PT0gXCJsb2NhbFwiID8gXCJcdTVERjJcdTc1MjJcdTc1MUZcIiA6IFwiXHU1REYyXHU2NkY0XHU2NUIwXCI7XG4gIC8vIFByZXBlbmQgcGhhc2UgdGltaW5ncyB0byB0aGUgYnJlYWtkb3duIHNvIHRoZSB1c2VyIGNhbiBzZWUgd2hpY2hcbiAgLy8gc3RlcCBpcyBzbG93IChOSEkgZmV0Y2ggaXMgdXN1YWxseSB0aGUgYnVsazsgYmFja2VuZCBtb2RlIGFkZHMgYW5cbiAgLy8gdXBsb2FkIHN0ZXAgbWVhc3VyZWQgaW4gMTAwcyBvZiBtcyBub3Qgc2Vjb25kcykuXG4gIGNvbnN0IF9waGFzZUxpbmVzID0gX3BoYXNlcy5tYXAoKHApID0+IGBcdTIzRjEgJHtwLm5hbWV9PSR7KHAubXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgKTtcbiAgY29uc3QgX2Z1bGxCcmVha2Rvd24gPSBbLi4uX3BoYXNlTGluZXMsIC4uLmJyZWFrZG93bl07XG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IGVycm9ycy5sZW5ndGhcbiAgICAgID8gYFx1MjZBMFx1RkUwRiBcdTU0MENcdTZCNjVcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMEMke2Vycm9ycy5sZW5ndGh9IFx1OTgwNVx1NTkzMVx1NjU1N1x1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWBcbiAgICAgIDogYFx1MjcwNSBcdTU0MENcdTZCNjVcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gLFxuICAgIHBoYXNlOiBcImRvbmVcIixcbiAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIGVsYXBzZWRNczogX2VsYXBzZWRNcyxcbiAgICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIGZvciB0aGUgcG9wdXAncyAnXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwJyBjb2xsYXBzaWJsZS5cbiAgICAvLyBLZWVwIGFzIGEgcGxhaW4gYXJyYXkgc28gcG9wdXAuanMgY2FuIHJlbmRlciB3aXRoIERPTSBBUEkgKG5vXG4gICAgLy8gaW5uZXJIVE1MIC8gbm8gZXNjYXBpbmcgY29uY2VybnMpLiBJdGVtcyBsb29rIGxpa2VcbiAgICAvLyAnZW5jb3VudGVycz0xMi8xMicgb3IgJ2FkdWx0X3ByZXZlbnRpdmU9MiByb3dzIFx1MjE5MiAzNiBvYnMnLlxuICAgIGJyZWFrZG93bjogX2Z1bGxCcmVha2Rvd24sXG4gICAgZXJyb3JzLFxuICAgIGhpc3RubzogcGF0aWVudE92ZXJyaWRlLmlkX25vLFxuICAgIG1vZGUsXG4gICAgbG9jYWxGaWxlbmFtZTogX2xvY2FsRmlsZW5hbWUsXG4gIH0pO1xuXG4gIC8vIFJlc3VtZSB0aGUgc2lkZWJhciBpZnJhbWUgbm93IHRoYXQgdGhlIE5ISSB0YWIgaXMgbm8gbG9uZ2VyIGJ1c3kuXG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNSdW5uaW5nOiBmYWxzZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgLy8gQmVzdC1lZmZvcnQ6IHdyaXRlIGEgU3luYyBIaXN0b3J5IHJvdyB0byB0aGUgYmFja2VuZCBzbyB0aGUgZGFzaGJvYXJkXG4gIC8vIGNhbiBzaG93IHdoZW4vd2hvL2hvdy1sb25nL3doYXQvcmFuZ2UuIFNraXBwZWQgaW4gbG9jYWwgbW9kZSAodGhlcmVcbiAgLy8gaXMgbm8gYmFja2VuZCkuIFdyYXBwZWQgKyBzd2FsbG93ZWQgc28gYSBsb2dnaW5nIGZhaWx1cmUgbmV2ZXJcbiAgLy8gcHJvcGFnYXRlcyBiYWNrIHRvIHRoZSB1c2VyLWZhY2luZyBzeW5jIHN0YXR1cy5cbiAgaWYgKG1vZGUgIT09IFwibG9jYWxcIikgdHJ5IHtcbiAgICBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL2xvZ2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzdGF0dXM6IGVycm9ycy5sZW5ndGggPyBcInBhcnRpYWxcIiA6IFwic3VjY2Vzc1wiLFxuICAgICAgICBwYXRpZW50X2lkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIixcbiAgICAgICAgLy8gL3N5bmMvbG9nIGxhbmRzIGluIHRoZSBkYXNoYm9hcmQncyBzeW5jLWhpc3RvcnkgdGFibGU7IG1hc2tcbiAgICAgICAgLy8gdGhlIG5hbWUgdGhlcmUgdG9vIHNvIHRoZSBkYXNoYm9hcmQgbmV2ZXIgc2VlcyB0aGUgcmF3IHZhbHVlLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIpLFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgYnJlYWtkb3duLFxuICAgICAgICBkYXRlX3JhbmdlOiBkYXRlUmFuZ2VMYWJlbCB8fCBcIlwiLFxuICAgICAgICBlbGFwc2VkX21zOiBfZWxhcHNlZE1zLFxuICAgICAgICBzdGFydGVkX2F0OiBuZXcgRGF0ZShfdDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGVycm9ycyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBmYWlsZWQgdG8gd3JpdGUgaGlzdG9yeSBsb2c6XCIsIGUpO1xuICB9XG4gIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbn1cblxuLy8gT24gaW5zdGFsbCAvIHVwZGF0ZSAvIGNocm9tZTovL2V4dGVuc2lvbnMgcmVsb2FkLCB0aGUgbmV3IHNpZGViYXIuanNcbi8vIGlzIHNoaXBwZWQgaW4gdGhlIGJ1bmRsZSBidXQgQ2hyb21lIHdvbid0IHJlLWluamVjdCBpdCBpbnRvIGFscmVhZHktXG4vLyBvcGVuIE5ISSB0YWJzIChjb250ZW50X3NjcmlwdHMgb25seSBmaXJlIGF0IGRvY3VtZW50X2lkbGUgb2YgZnJlc2hcbi8vIGxvYWRzKS4gV2l0aG91dCB0aGlzLCBzZXR0aW5ncyBpbnRyb2R1Y2VkIGluIHRoZSBuZXcgdmVyc2lvbiAoZS5nLlxuLy8gdGhlIHNpZGViYXJFbmFibGVkIHRvZ2dsZSkgYXBwZWFyIGluZXJ0IG9uIG9wZW4gdGFicyB1bnRpbCBGNS5cbi8vIEZvcmNlLWluamVjdCBzbyB0aGUgdG9nZ2xlIHRha2VzIGVmZmVjdCBpbW1lZGlhdGVseS5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgbGV0IHRhYnM7XG4gIHRyeSB7XG4gICAgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgdXJsOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvKlwiIH0pO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yIChjb25zdCB0YWIgb2YgdGFicykge1xuICAgIGNocm9tZS5zY3JpcHRpbmdcbiAgICAgIC5leGVjdXRlU2NyaXB0KHsgdGFyZ2V0OiB7IHRhYklkOiB0YWIuaWQgfSwgZmlsZXM6IFtcInNpZGViYXIuanNcIl0gfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7fSk7XG4gIH1cbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdGFydE5oaUFwaVN5bmNcIikge1xuICAgIHJ1bk5oaUFwaVN5bmMobXNnLnBheWxvYWQpLnRoZW4oXG4gICAgICAoKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pOyB9IGNhdGNoIHt9IH0sXG4gICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHNpZGViYXIgaWZyYW1lIGdldHMgdW4tcGF1c2VkIG9uIGV2ZXJ5IGV4aXQgcGF0aFxuICAgICAgICAvLyAoc3VjY2VzcyBydW5zIHRoaXMgZnJvbSBpbnNpZGUgcnVuTmhpQXBpU3luYzsgY2FuY2VsICsgZXJyb3IgK1xuICAgICAgICAvLyBzZXNzaW9uLWV4cGlyZWQgYmFpbCBiZWZvcmUgcmVhY2hpbmcgdGhhdCBwb2ludCkuXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNSdW5uaW5nOiBmYWxzZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBDQU5DRUxfRVJST1IpIHtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSwgY2FuY2VsbGVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBTRVNTSU9OX0VYUElSRURfRVJST1IpIHtcbiAgICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERDEyIE5ISSBzZXNzaW9uIFx1NURGMlx1NzY3Qlx1NTFGQSBcdTIwMTQgXHU4QUNCXHU1NzI4IE5ISSB0YWIgXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHU1RjhDXHU1MThEXHU5RURFIFN5bmNcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwic2Vzc2lvbl9leHBpcmVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXhwaXJlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwicnVuTmhpQXBpU3luYyBmYWlsZWRcIiwgZSk7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHJ1bm5pbmc6IGZhbHNlLCBwcm9ncmVzczogYFx1Mjc0QyAke2UubWVzc2FnZX1gLCBwaGFzZTogXCJlcnJvclwiIH0pO1xuICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yOiBlLm1lc3NhZ2UgfSk7IH0gY2F0Y2gge31cbiAgICAgIH0sXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcInN0b3BTeW5jXCIpIHtcbiAgICAvLyBTZXQgdGhlIGNhbmNlbGxhdGlvbiBmbGFnOyB0aGUgaW4tZmxpZ2h0IHN5bmMgd2lsbCB0aHJvd1xuICAgIC8vIENBTkNFTF9FUlJPUiBhdCBpdHMgbmV4dCBjaGVja0NhbmNlbCgpIGNhbGwuICBTdG9yYWdlIGlzIGFscmVhZHlcbiAgICAvLyB1cGRhdGVkIGJ5IHRoZSBwb3B1cCwgc28gd2UgZG9uJ3QgdG91Y2ggaXQgaGVyZS5cbiAgICBfY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAvLyBEaXNjYXJkIGFueSBwYXJ0aWFsIGRhdGEgdXBsb2FkZWQgc28gZmFyLiBUaGUgdXNlcidzIHN0YXRlZFxuICAgIC8vIGNvbnRyYWN0IGlzICdzdG9wID0gYWJvcnQsIEknbGwgcmVzeW5jIGZyb20gc2NyYXRjaCBsYXRlcicgXHUyMDE0IHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsZWF2ZSBhIGhhbGYtbG9hZGVkIHBhdGllbnQgaW4gdGhlIEZISVIgc3RvcmUgdGhhdFxuICAgIC8vIGxvb2tzIGNvbXBsZXRlIHRvIGRvd25zdHJlYW0gU01BUlQgYXBwcy5cbiAgICBjb25zdCBjdHggPSBfYWN0aXZlU3luY0N0eDtcbiAgICBpZiAoY3R4Py5wYXRpZW50SWQgJiYgY3R4LmJhY2tlbmQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtjdHguYmFja2VuZH0vc3luYy9wYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eC5wYXRpZW50SWQpfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgaGVhZGVyczogY3R4LnN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogY3R4LnN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIFN1cmZhY2UgdGhlIHdpcGUgaW4gdGhlIHN0YXR1cyBzbyB1c2VyIHNlZXMgaXQgYWN0dWFsbHkgaGFwcGVuZWQuXG4gICAgICAgICAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIFtTVE9SQUdFX0tFWV06IHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTVERjJcdTUwNUNcdTZCNjJcdTRFMjZcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdTU0MENcdTZCNjVcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1OTFDRFx1NjVCMFx1NTQwQ1x1NkI2NVwiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGNhbmNlbCB3aXBlIGZhaWxlZDpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbiAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiZ2V0U3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkYXRhKSA9PiBzZW5kUmVzcG9uc2UoZGF0YVtTVE9SQUdFX0tFWV0gfHwgbnVsbCkpO1xuICAgIHJldHVybiB0cnVlOyAgLy8gYXN5bmMgcmVzcG9uc2VcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNsZWFyU3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZKS50aGVuKCgpID0+IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG5cbi8vIEJlbHQtYW5kLXN1c3BlbmRlcnMgU1cga2VlcGFsaXZlOiBhbiBhbGFybSBldmVyeSAyMCBzIHdha2VzIHRoZSBTVyBpZlxuLy8gaWRsZS4gQ29tYmluZWQgd2l0aCB0aGUgcmV0dXJuLXRydWUgcGF0dGVybiBhYm92ZSwgdGhpcyBwcmV2ZW50cyB0aGVcbi8vIDMwIHMgaWRsZSBzaHV0ZG93biBmcm9tIGVuZGluZyBhbiBpbi1wcm9ncmVzcyBzeW5jLlxuY2hyb21lLmFsYXJtcy5jcmVhdGUoXCJzdy1rZWVwYWxpdmVcIiwgeyBwZXJpb2RJbk1pbnV0ZXM6IDAuMzQgfSk7XG5jaHJvbWUuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoKCkgPT4geyAvKiBuby1vcDsgcHJlc2VuY2UgaXMgdGhlIHBvaW50ICovIH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFTQSxPQUFDLFdBQVc7QUFDVjtBQUVBLFlBQUksY0FBYztBQUNsQixZQUFJLGlCQUFpQjtBQUNyQixZQUFJLFNBQVMsT0FBTyxXQUFXO0FBQy9CLFlBQUksT0FBTyxTQUFTLFNBQVMsQ0FBQztBQUM5QixZQUFJLEtBQUssbUJBQW1CO0FBQzFCLG1CQUFTO0FBQUEsUUFDWDtBQUNBLFlBQUksYUFBYSxDQUFDLFVBQVUsT0FBTyxTQUFTO0FBQzVDLFlBQUksVUFBVSxDQUFDLEtBQUssc0JBQXNCLE9BQU8sWUFBWSxZQUFZLFFBQVEsWUFBWSxRQUFRLFNBQVM7QUFDOUcsWUFBSSxTQUFTO0FBQ1gsaUJBQU87QUFBQSxRQUNU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VixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFB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QUs7QUFBQSxJQUNMLEtBQUs7QUFBQTtBQUFBLElBQ0wsU0FBUztBQUFBO0FBQUEsSUFDVCxNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUE7QUFBQTtBQUFBLElBRUwsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFaLFVBQVU7QUFBQTtBQUFBLElBQ1YsaUJBQWlCO0FBQUE7QUFBQSxJQUNqQixhQUFhO0FBQUE7QUFBQSxFQUNmO0FBUU8sTUFBTSxnQkFBd0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUluRCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVdYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJ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a0MsQ0FBQztBQUFBLFVBQ2xEO0FBQUEsUUFDRixHQUFHO0FBQUEsTUFDTDtBQUNBLHVCQUFpQjtBQUNqQixVQUFJO0FBQUUscUJBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQUcsUUFBUTtBQUFBLE1BQUM7QUFDM0MsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsYUFBTyxRQUFRLE1BQU0sSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFDNUYsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxtQkFBbUI7QUFDbkMsYUFBTyxRQUFRLE1BQU0sT0FBTyxXQUFXLEVBQUUsS0FBSyxNQUFNLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQzlFLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImNqa0NoYXJzIiwgIm9ic0lkIiwgIm1hcFN5c3RlbSIsICJyIl0KfQo=
