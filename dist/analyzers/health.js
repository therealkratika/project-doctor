export function calculateHealth(input) {
    let score = 100;
    // Dependency penalties
    score -= input.unusedDependencies * 5;
    score -= input.unusedDevDependencies * 2;
    // Security penalties
    score -= input.vulnerabilities.low * 2;
    score -= input.vulnerabilities.moderate * 5;
    score -= input.vulnerabilities.high * 15;
    score -= input.vulnerabilities.critical * 25;
    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));
    let status = "Excellent";
    if (score < 90) {
        status = "Good";
    }
    if (score < 75) {
        status = "Needs Attention";
    }
    if (score < 50) {
        status = "Poor";
    }
    return {
        score,
        status,
    };
}
