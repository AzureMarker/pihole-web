/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Utility function tests
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import { validate } from "./validate";

describe("Testing the validation functions", () => {
  describe("validate.domain", () => {
    describe("should pass", () => {
      it("validates a proper 4-segment domain", () => {
        const result = validate.domain("good.sub.domain.com");
        expect(result).toBe(true);
      });

      it("validates a proper 3-segment domain", () => {
        const result = validate.domain("good.domain.com");
        expect(result).toBe(true);
      });

      it("validates a proper 2-segment domain", () => {
        const result = validate.domain("good.domain");
        expect(result).toBe(true);
      });

      it("validates extreme but valid cases", () => {
        // 253 long, segments < 63 individually
        const almostTooLong = validate.domain(
          "segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeent"
        );
        // Segment is 63 long
        const almostTooLongSegment = validate.domain(
          "short.loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong.short"
        );
        expect(almostTooLong).toBe(true);
        expect(almostTooLongSegment).toBe(true);
      });
    });

    describe("should fail", () => {
      it("rejects a single segment domain 'domain'", () => {
        const result = validate.domain("domain");
        expect(result).toBe(false);
      });

      it("rejects 'domain..com'", () => {
        const result = validate.domain("domain..com");
        expect(result).toBe(false);
      });

      it("rejects '..domain.com'", () => {
        const result = validate.domain("..domain.com");
        expect(result).toBe(false);
      });

      it("rejects '.domain.com'", () => {
        const result = validate.domain(".domain.com");
        expect(result).toBe(false);
      });

      it("rejects '..domain.com'", () => {
        const result = validate.domain("..domain.com");
        expect(result).toBe(false);
      });

      it("rejects 'domain.com.'", () => {
        const result = validate.domain("domain.com.");
        expect(result).toBe(false);
      });

      it("rejects domains that are >253 long", () => {
        // 254 long, segments < 63 individually
        const result = validate.domain(
          "segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeent"
        );
        expect(result).toBe(false);
      });

      it("rejects domains with segments that are too long", () => {
        // Long is 64 chars, but only 63 allowed max
        const result = validate.domain(
          "short.looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong.short"
        );
        expect(result).toBe(false);
      });

      it("rejects domains that are numbers and . only", () => {
        // Long is 64 chars, but only 63 allowed max
        const result = validate.domain("123.321.123123");
        expect(result).toBe(false);
      });
    });
  });

  describe("validate.isStrictNumeric", () => {
    it("passes 1234567890", () => {
      const result = validate.isStrictNumeric("1234567890");
      expect(result).toBe(true);
    });

    it("fails 1234a567890", () => {
      const result = validate.isStrictNumeric("1234a567890");
      expect(result).toBe(false);
    });

    it("fails 1100101O1", () => {
      const result = validate.isStrictNumeric("1100101O1");
      expect(result).toBe(false);
    });
  });
});
