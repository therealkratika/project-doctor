import { describe, it, expect } from "vitest";
import { calculateHealth } from "../src/analyzers/health.js";

describe("calculateHealth", () => {
  it("should return 100 for a healthy project", () => {
    const result = calculateHealth({
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      vulnerabilities: {
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
      },
      failedChecks: 0,
    });

    expect(result.score).toBe(100);
    expect(result.status).toBe("Excellent");
  });

  it("should reduce the score for failed checks", () => {
    const result = calculateHealth({
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      vulnerabilities: {
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
      },
      failedChecks: 2,
    });

    expect(result.score).toBeLessThan(100);
  });

  it("should reduce the score for vulnerabilities", () => {
    const result = calculateHealth({
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      vulnerabilities: {
        critical: 1,
        high: 1,
        moderate: 0,
        low: 0,
      },
      failedChecks: 0,
    });

    expect(result.score).toBeLessThan(100);
  });
});