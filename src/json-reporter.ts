interface JsonReportData {
  project: {
    projectName: string;
    projectPath: string;
  };

  packageJson: {
    name: string;
    framework: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  technology: {
    framework: string;
    language: string;
    styling: string;
    database: string;
    orm: string;
  };

  projectChecks: {
    name: string;
    passed: boolean;
    message: string;
  }[];

  dependencyAnalysis: {
    unusedDependencies: string[];
    unusedDevDependencies: string[];
  };

  securityAnalysis: {
    total: number;
    vulnerabilities: {
      critical: number;
      high: number;
      moderate: number;
      low: number;
    };
  };

  health: {
    score: number;
    status: string;
  };

  recommendations: {
    type: "warning" | "info" | "success";
    message: string;
    command?: string;
  }[];

  fixes: {
    name: string;
    fixed: boolean;
    message: string;
  }[];
}

export function printJsonReport(
  data: JsonReportData,
): void {
  console.log(
    JSON.stringify(data, null, 2),
  );
}
