import { execFileSync } from "node:child_process";

interface SecurityResult {
  vulnerabilities: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  total: number;
}

export function analyzeSecurity(): SecurityResult {
  try {
    const output = execFileSync(
      "npm",
      ["audit", "--json"],
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const auditResult = JSON.parse(output);

    return {
      vulnerabilities: auditResult.metadata.vulnerabilities,
      total: auditResult.metadata.vulnerabilities.total,
    };
  } catch (error: any) {
    if (error.stdout) {
      try {
        const auditResult = JSON.parse(error.stdout.toString());

        return {
          vulnerabilities: auditResult.metadata.vulnerabilities,
          total: auditResult.metadata.vulnerabilities.total,
        };
      } catch {
        // Fall through to the default result.
      }
    }

    return {
      vulnerabilities: {
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0,
      },
      total: 0,
    };
  }
}