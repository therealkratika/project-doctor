export function calculateHealth(input) {
    let score = 100;
    // --------------------------------
    // Unused production dependencies
    // --------------------------------
    score -= input.unusedDependencies * 3;
    // --------------------------------
    // Unused development dependencies
    // --------------------------------
    score -= input.unusedDevDependencies * 1;
    // --------------------------------
    // Security vulnerabilities
    // --------------------------------
    score -= input.vulnerabilities.critical * 20;
    score -= input.vulnerabilities.high * 10;
    score -= input.vulnerabilities.moderate * 5;
    score -= input.vulnerabilities.low * 1;
    // --------------------------------
    // Failed project checks
    // --------------------------------
    score -= input.failedChecks * 3;
    // --------------------------------
    // Keep score between 0 and 100
    // --------------------------------
    score = Math.max(0, Math.min(100, score));
    // --------------------------------
    // Health status
    // --------------------------------
    let status;
    if (score >= 90) {
        status = "Excellent";
    }
    else if (score >= 75) {
        status = "Good";
    }
    else if (score >= 50) {
        status = "Needs Attention";
    }
    else {
        status = "Poor";
    }
    return {
        score,
        status,
    };
}
