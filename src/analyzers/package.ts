
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

  // Check if package.json exists
  if (!fs.existsSync(packagePath)) {
    return null;
  }

  // Read package.json
  let packageJson: Record<string, any>;

  try {
    const packageFile = fs.readFileSync(
      packagePath,
      "utf-8",
    );

    packageJson = JSON.parse(packageFile);
  } catch {
    return null;
  }

  const dependencies =
    packageJson.dependencies ?? {};

  const devDependencies =
    packageJson.devDependencies ?? {};

  // Combine dependencies for framework detection
  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  };

  let framework = "Unknown";

  // Full-stack / meta frameworks
  if (allDependencies.next) {
    framework = "Next.js";
  } else if (allDependencies.nuxt) {
    framework = "Nuxt";
  } else if (allDependencies["@angular/core"]) {
    framework = "Angular";
  } else if (allDependencies["@sveltejs/kit"]) {
    framework = "SvelteKit";
  }

  // Frontend frameworks
  else if (allDependencies.react) {
    framework = "React";
  } else if (allDependencies.vue) {
    framework = "Vue";
  } else if (allDependencies.svelte) {
    framework = "Svelte";
  }

  // Backend frameworks
  else if (allDependencies["@nestjs/core"]) {
    framework = "NestJS";
  } else if (allDependencies.express) {
    framework = "Express";
  }

  // Build tools
  else if (allDependencies.vite) {
    framework = "Vite";
  }

  return {
    name: packageJson.name ?? "Unknown",
    dependencies,
    devDependencies,
    framework,
  };
}

