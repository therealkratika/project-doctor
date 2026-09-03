import fs from "node:fs";
import path from "node:path";

interface DependencyAnalysis {
  unusedDependencies: string[];
  unusedDevDependencies: string[];
  missingDependencies: string[];
}

interface PackageJson {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function analyzeDependencies(
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
): DependencyAnalysis {
  const projectPath = process.cwd();

  const files = getProjectFiles(projectPath);

  // --------------------------------
  // Read source files
  // --------------------------------

  let sourceCode = "";

  for (const file of files) {
    try {
      sourceCode += fs.readFileSync(file, "utf-8") + "\n";
    } catch {
      // Ignore unreadable files
    }
  }

  // --------------------------------
  // Read package.json
  // --------------------------------

  const packageJson = readPackageJson(projectPath);

  // --------------------------------
  // Get scripts
  // --------------------------------

  const scripts = Object.values(
    packageJson?.scripts ?? {},
  ).join("\n");

  // --------------------------------
  // Get configuration files
  // --------------------------------

  const configCode = readConfigFiles(projectPath);

  const searchableContent = [
    sourceCode,
    scripts,
    configCode,
  ].join("\n");

  // --------------------------------
  // Analyze production dependencies
  // --------------------------------

  const unusedDependencies: string[] = [];

  for (const dependency of Object.keys(dependencies)) {
    if (!isDependencyUsed(dependency, searchableContent)) {
      unusedDependencies.push(dependency);
    }
  }

  // --------------------------------
  // Analyze development dependencies
  // --------------------------------

  const unusedDevDependencies: string[] = [];

  for (const dependency of Object.keys(devDependencies)) {
    /*
     * @types/node is special.
     *
     * Node type definitions can be used automatically by
     * TypeScript without an explicit import of "@types/node".
     *
     * If the project uses Node APIs such as:
     *   node:fs
     *   node:path
     *   process
     *   __dirname
     *
     * we consider @types/node to be used.
     */
    if (
      dependency === "@types/node" &&
      usesNodeTypes(sourceCode, configCode)
    ) {
      continue;
    }

    if (!isDependencyUsed(dependency, searchableContent)) {
      unusedDevDependencies.push(dependency);
    }
  }

  // --------------------------------
  // Analyze missing dependencies
  // --------------------------------

  const installedDependencies = new Set([
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
  ]);

  const importedPackages =
    extractImportedPackages(sourceCode);

  const missingDependencies: string[] = [];

  for (const packageName of importedPackages) {
    if (!installedDependencies.has(packageName)) {
      missingDependencies.push(packageName);
    }
  }

  return {
    unusedDependencies,
    unusedDevDependencies,
    missingDependencies,
  };
}

// --------------------------------
// Check if dependency is used
// --------------------------------

function isDependencyUsed(
  dependency: string,
  content: string,
): boolean {
  const escapedDependency = escapeRegExp(dependency);

  // --------------------------------
  // ES module imports
  // --------------------------------

  const importPattern = new RegExp(
    `(?:from\\s+|import\\s*\\(?\\s*|require\\(\\s*)["']${escapedDependency}(?:/[^"']*)?["']`,
  );

  if (importPattern.test(content)) {
    return true;
  }

  // --------------------------------
  // Package name inside scripts/config
  // --------------------------------

  const packagePattern = new RegExp(
    `(^|[^a-zA-Z0-9_-])${escapedDependency}([^a-zA-Z0-9_-]|$)`,
  );

  return packagePattern.test(content);
}

// --------------------------------
// Check whether Node types are used
// --------------------------------

function usesNodeTypes(
  sourceCode: string,
  configCode: string,
): boolean {
  // Node built-in imports
  const nodeImportPattern =
    /(?:from\s+|import\s*\(\s*|require\(\s*)["']node:[^"']+["']/;

  if (nodeImportPattern.test(sourceCode)) {
    return true;
  }

  // Common Node globals
  const nodeGlobalPattern =
    /\b(process|Buffer|__dirname|__filename|global|setImmediate)\b/;

  if (nodeGlobalPattern.test(sourceCode)) {
    return true;
  }

  // tsconfig explicitly references Node types
  const nodeTypesPattern =
    /["']node["']/;

  if (nodeTypesPattern.test(configCode)) {
    return true;
  }

  return false;
}

// --------------------------------
// Extract imported packages
// --------------------------------

function extractImportedPackages(
  sourceCode: string,
): string[] {
  const packages = new Set<string>();

  // Matches:
  //
  // import x from "package"
  // import { x } from "package"
  // import "package"
  // import("package")
  // require("package")
  //
  const importPattern =
    /(?:import\s+(?:[\s\S]*?\s+from\s+)?|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g;

  let match: RegExpExecArray | null;

  while (
    (match = importPattern.exec(sourceCode)) !== null
  ) {
    const imported = match[1];

    // --------------------------------
    // Ignore relative imports
    // --------------------------------

    if (
      imported.startsWith(".") ||
      imported.startsWith("/")
    ) {
      continue;
    }

    // --------------------------------
    // Ignore Node.js built-in modules
    // --------------------------------

    if (imported.startsWith("node:")) {
      continue;
    }

    // --------------------------------
    // Ignore built-in Node modules without node:
    // --------------------------------

    if (isNodeBuiltin(imported)) {
      continue;
    }

    // --------------------------------
    // Get package root
    // --------------------------------

    const packageName = imported.startsWith("@")
      ? imported.split("/").slice(0, 2).join("/")
      : imported.split("/")[0];

    packages.add(packageName);
  }

  return [...packages];
}

// --------------------------------
// Node.js built-in modules
// --------------------------------

function isNodeBuiltin(
  packageName: string,
): boolean {
  const builtins = new Set([
    "assert",
    "assert/strict",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "dns/promises",
    "domain",
    "events",
    "fs",
    "fs/promises",
    "http",
    "http2",
    "https",
    "module",
    "net",
    "os",
    "path",
    "path/posix",
    "path/win32",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "readline/promises",
    "repl",
    "stream",
    "stream/consumers",
    "stream/promises",
    "stream/web",
    "string_decoder",
    "sys",
    "timers",
    "timers/promises",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "util/types",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib",
  ]);

  return builtins.has(packageName);
}

// --------------------------------
// Read package.json
// --------------------------------

function readPackageJson(
  projectPath: string,
): PackageJson | null {
  const packagePath = path.join(
    projectPath,
    "package.json",
  );

  if (!fs.existsSync(packagePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(
      packagePath,
      "utf-8",
    );

    return JSON.parse(content) as PackageJson;
  } catch {
    return null;
  }
}

// --------------------------------
// Read configuration files
// --------------------------------

function readConfigFiles(
  projectPath: string,
): string {
  const configFiles = [
    "tsconfig.json",

    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",

    ".eslintrc",
    ".eslintrc.json",
    ".eslintrc.js",

    ".prettierrc",
    "prettier.config.js",
    "prettier.config.mjs",

    "vite.config.ts",
    "vite.config.js",

    "next.config.js",
    "next.config.mjs",
    "next.config.ts",

    "jest.config.js",
    "jest.config.ts",

    "vitest.config.ts",
    "vitest.config.js",
  ];

  let content = "";

  for (const file of configFiles) {
    const filePath = path.join(
      projectPath,
      file,
    );

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      content +=
        fs.readFileSync(filePath, "utf-8") + "\n";
    } catch {
      // Ignore unreadable config files
    }
  }

  return content;
}

// --------------------------------
// Find source files
// --------------------------------

function getProjectFiles(
  directory: string,
): string[] {
  const files: string[] = [];

  const ignoredDirectories = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
  ]);

  const supportedExtensions = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
  ]);

  function walk(
    currentDirectory: string,
  ): void {
    let entries: fs.Dirent[];

    try {
      entries = fs.readdirSync(
        currentDirectory,
        {
          withFileTypes: true,
        },
      );
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(
        currentDirectory,
        entry.name,
      );

      // --------------------------------
      // Directories
      // --------------------------------

      if (entry.isDirectory()) {
        if (
          !ignoredDirectories.has(entry.name)
        ) {
          walk(fullPath);
        }

        continue;
      }

      // --------------------------------
      // Files
      // --------------------------------

      if (!entry.isFile()) {
        continue;
      }

      if (
        supportedExtensions.has(
          path.extname(entry.name),
        )
      ) {
        files.push(fullPath);
      }
    }
  }

  walk(directory);

  return files;
}

// --------------------------------
// Escape regular expression
// --------------------------------

function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}
