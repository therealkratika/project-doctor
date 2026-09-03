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
}

export function printJsonReport(
  data: JsonReportData,
): void {
  const report = {
    project: {
      name: data.project.projectName,
      path: data.project.projectPath,
    },

    package: {
      name: data.packageJson.name,
      framework: data.packageJson.framework,
    },

    technology: data.technology,

    dependencies: {
      production: Object.keys(
        data.packageJson.dependencies,
      ).length,

      development: Object.keys(
        data.packageJson.devDependencies,
      ).length,

      unused: data.dependencyAnalysis.unusedDependencies,

      unusedDev: data.dependencyAnalysis
        .unusedDevDependencies,
    },

    checks: data.projectChecks,

    security: data.securityAnalysis,

    health: data.health,
  };

  console.log(
    JSON.stringify(report, null, 2),
  );
}
