export interface Recommendation {
  type: "warning" | "info" | "success";
  message: string;
  command?: string;
}

interface RecommendationInput {
  projectChecks: {
    name: string;
    passed: boolean;
    message: string;
  }[];

  unusedDependencies: string[];
  unusedDevDependencies: string[];

  vulnerabilities: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };

  healthScore: number;
}

export function generateRecommendations(
  input: RecommendationInput,
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // --------------------------------
  // README
  // --------------------------------

  const readmeCheck = input.projectChecks.find(
    (check) => check.name === "README",
  );

  if (readmeCheck && !readmeCheck.passed) {
    recommendations.push({
      type: "warning",
      message: "Add a README.md file to document your project.",
    });
  }

  // --------------------------------
  // Gitignore
  // --------------------------------

  const gitignoreCheck = input.projectChecks.find(
    (check) => check.name === ".gitignore",
  );

  if (gitignoreCheck && !gitignoreCheck.passed) {
    recommendations.push({
      type: "warning",
      message: "Add a .gitignore file to protect local files.",
    });
  }

  // --------------------------------
  // Tests
  // --------------------------------

  const testCheck = input.projectChecks.find(
    (check) => check.name === "Tests",
  );

  if (testCheck && !testCheck.passed) {
    recommendations.push({
      type: "info",
      message: "Add a test script to your project.",
      command: "npm test",
    });
  }

  // --------------------------------
  // Lint
  // --------------------------------

  const lintCheck = input.projectChecks.find(
    (check) => check.name === "Lint",
  );

  if (lintCheck && !lintCheck.passed) {
    recommendations.push({
      type: "info",
      message: "Add a lint script to catch code quality issues.",
      command: "npm run lint",
    });
  }

  // --------------------------------
  // Unused dependencies
  // --------------------------------

  if (input.unusedDependencies.length > 0) {
    recommendations.push({
      type: "warning",
      message: `Review ${input.unusedDependencies.length} potentially unused production dependencies.`,
    });
  }

  // --------------------------------
  // Unused dev dependencies
  // --------------------------------

  if (input.unusedDevDependencies.length > 0) {
    recommendations.push({
      type: "warning",
      message: `Review ${input.unusedDevDependencies.length} potentially unused development dependencies.`,
    });
  }

  // --------------------------------
  // Security vulnerabilities
  // --------------------------------

  const vulnerabilities =
    input.vulnerabilities;

  if (vulnerabilities.critical > 0) {
    recommendations.push({
      type: "warning",
      message: "Critical security vulnerabilities detected.",
      command: "npm audit",
    });
  }

  if (vulnerabilities.high > 0) {
    recommendations.push({
      type: "warning",
      message: "High severity security vulnerabilities detected.",
      command: "npm audit",
    });
  }

  if (vulnerabilities.moderate > 0) {
    recommendations.push({
      type: "info",
      message: "Moderate security vulnerabilities detected.",
      command: "npm audit",
    });
  }

  // --------------------------------
  // Health score
  // --------------------------------

  if (input.healthScore >= 90) {
    recommendations.push({
      type: "success",
      message: "Your project is in excellent health.",
    });
  } else if (input.healthScore >= 75) {
    recommendations.push({
      type: "info",
      message: "Your project is in good shape, but there are a few improvements to make.",
    });
  } else if (input.healthScore >= 50) {
    recommendations.push({
      type: "warning",
      message: "Your project needs attention. Review the issues above.",
    });
  } else {
    recommendations.push({
      type: "warning",
      message: "Your project has significant issues that should be addressed.",
    });
  }

  return recommendations;
}

