import fs from "node:fs";
import path from "node:path";

interface PackageInfo {
  name: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  framework: string;
}

export function analyzePackage(): PackageInfo | null {
  const projectPath = process.cwd();
  const packagePath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packagePath)) {
    return null;
  }

  const packageFile = fs.readFileSync(packagePath, "utf-8");
  const packageJson = JSON.parse(packageFile);

  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  let framework = "Unknown";

  if (dependencies.next || devDependencies.next) {
    framework = "Next.js";
  } else if (dependencies.react || devDependencies.react) {
    framework = "React";
  } else if (dependencies.express || devDependencies.express) {
    framework = "Express";
  } else if (dependencies.vue || devDependencies.vue) {
    framework = "Vue";
  }

  return {
    name: packageJson.name ?? "Unknown",
    dependencies,
    devDependencies,
    framework,
  };
}