/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Validation  function tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import {
  isPositiveNumber,
  isValidDomain,
  isValidIpv4,
  isValidIpv4OptionalPort,
  isValidRegex
} from "../validate";

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

  describe("isPositiveNumber", () => {
    it("passes 1234567890", () => {
      const result = isPositiveNumber("1234567890");
      expect(result).toBe(true);
    });

    it("fails 1234a567890", () => {
      const result = isPositiveNumber("1234a567890");
      expect(result).toBe(false);
    });

    it("fails 1100101O1", () => {
      const result = isPositiveNumber("1100101O1");
      expect(result).toBe(false);
    });

    it("fails empty string", () => {
      const result = isPositiveNumber("");
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

  describe("isValidIpv4", () => {
    it("passes 127.0.0.1", () => {
      expect(isValidIpv4("127.0.0.1")).toBe(true);
    });

    it("passes 1.1.1.1", () => {
      expect(isValidIpv4("1.1.1.1")).toBe(true);
    });

    it("passes 111.111.111.111", () => {
      expect(isValidIpv4("111.111.111.111")).toBe(true);
    });

    it("fails 1111.1.1.1", () => {
      expect(isValidIpv4("1111.1.1.1")).toBe(false);
    });

    it("fails 1.1.1.", () => {
      expect(isValidIpv4("1.1.1.")).toBe(false);
    });

    it("fails empty string", () => {
      expect(isValidIpv4("")).toBe(false);
    });

    it("fails 8.8", () => {
      expect(isValidIpv4("8.8")).toBe(false);
    });

    it("fails 10. 10.1.1", () => {
      expect(isValidIpv4("10. 10.1.1")).toBe(false);
    });

    it("fails 555.666.777.888", () => {
      expect(isValidIpv4("555.666.777.888")).toBe(false);
    });
  });

  describe("isValidIpv4OptionalPort", () => {
    it("passes 127.0.0.1", () => {
      expect(isValidIpv4OptionalPort("127.0.0.1")).toBe(true);
    });

    it("passes 127.0.0.1:53", () => {
      expect(isValidIpv4OptionalPort("127.0.0.1:53")).toBe(true);
    });

    it("passes 8.8.8.8:5353", () => {
      expect(isValidIpv4OptionalPort("8.8.8.8:5353")).toBe(true);
    });

    it("fails 1111.1.1.1:53", () => {
      expect(isValidIpv4OptionalPort("1111.1.1.1:53")).toBe(false);
    });

    it("fails 8.8.8.8:", () => {
      expect(isValidIpv4OptionalPort("8.8.8.8:")).toBe(false);
    });

    it("fails 8.8.8.8::", () => {
      expect(isValidIpv4OptionalPort("8.8.8.8::")).toBe(false);
    });

    it("fails 8.8.8.8:53:", () => {
      expect(isValidIpv4OptionalPort("8.8.8.8:53:")).toBe(false);
    });

    it("fails 8.8.8.8:abc", () => {
      expect(isValidIpv4OptionalPort("8.8.8.8:abc")).toBe(false);
    });

    it("fails 127.0.0.1#53", () => {
      expect(isValidIpv4OptionalPort("127.0.0.1#53")).toBe(false);
    });
  });
});
