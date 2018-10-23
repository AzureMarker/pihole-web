/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Validation  function tests
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import { isStrictNumeric, isValidDomain, isValidRegex } from "./validate";

describe("Testing the validation functions", () => {
  describe("isValidDomain", () => {
    describe("should pass", () => {
      it("validates a proper 4-segment domain", () => {
        const result = isValidDomain("good.sub.domain.com");
        expect(result).toBe(true);
      });

      it("validates a proper 3-segment domain", () => {
        const result = isValidDomain("good.domain.com");
        expect(result).toBe(true);
      });

      it("validates a proper 2-segment domain", () => {
        const result = isValidDomain("good.domain");
        expect(result).toBe(true);
      });

      it("validates extreme but valid cases", () => {
        // 253 long, segments < 63 individually
        const almostTooLong = isValidDomain(
          "segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeent"
        );
        // Segment is 63 long
        const almostTooLongSegment = isValidDomain(
          "short.loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong.short"
        );
        expect(almostTooLong).toBe(true);
        expect(almostTooLongSegment).toBe(true);
      });
    });

    describe("should fail", () => {
      it("rejects '&.domain.com'", () => {
        const result = isValidDomain("&.domain.com");
        expect(result).toBe(false);
      });

      it("rejects a single segment domain 'domain'", () => {
        const result = isValidDomain("domain");
        expect(result).toBe(false);
      });

      it("rejects 'domain..com'", () => {
        const result = isValidDomain("domain..com");
        expect(result).toBe(false);
      });

      it("rejects '..domain.com'", () => {
        const result = isValidDomain("..domain.com");
        expect(result).toBe(false);
      });

      it("rejects '.domain.com'", () => {
        const result = isValidDomain(".domain.com");
        expect(result).toBe(false);
      });

      it("rejects '..domain.com'", () => {
        const result = isValidDomain("..domain.com");
        expect(result).toBe(false);
      });

      it("rejects 'domain.com.'", () => {
        const result = isValidDomain("domain.com.");
        expect(result).toBe(false);
      });

      it("rejects domains that are >253 long", () => {
        // 254 long, segments < 63 individually
        const result = isValidDomain(
          "segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeeent.segmeeeeeeeent"
        );
        expect(result).toBe(false);
      });

      it("rejects domains with segments that are too long", () => {
        // Long is 64 chars, but only 63 allowed max
        const result = isValidDomain(
          "short.looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong.short"
        );
        expect(result).toBe(false);
      });

      it("rejects domains that are numbers and . only", () => {
        // Long is 64 chars, but only 63 allowed max
        const result = isValidDomain("123.321.123123");
        expect(result).toBe(false);
      });
    });
  });

  describe("isStrictNumeric", () => {
    it("passes 1234567890", () => {
      const result = isStrictNumeric("1234567890");
      expect(result).toBe(true);
    });

    it("fails 1234a567890", () => {
      const result = isStrictNumeric("1234a567890");
      expect(result).toBe(false);
    });

    it("fails 1100101O1", () => {
      const result = isStrictNumeric("1100101O1");
      expect(result).toBe(false);
    });
  });

  describe("isValidRegex", () => {
    it("should validate simple regex", () => {
      expect(isValidRegex("[0-9]+")).toBe(true);
    });

    it("should validate complex regex", () => {
      expect(
        isValidRegex(
          "^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$"
        )
      ).toBe(true);
    });

    it("should not pass regex validation when preceding token is not quantifiable", () => {
      expect(isValidRegex("abc*{1}")).toBe(false);
    });

    it("should not pass regex validation when missing closing bracket", () => {
      expect(isValidRegex("[0-")).toBe(false);
    });
  });
});
