import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { analyzeDependencies } from "../src/analyzers/dependencies.js";

let tempProject: string | null = null;

function createTempProject(
  files: Record<string, string>,
): string {
  tempProject = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "project-doctor-test-",
    ),
  );

  for (const [fileName, content] of Object.entries(
    files,
  )) {
    const filePath = path.join(
      tempProject,
      fileName,
    );

    fs.mkdirSync(
      path.dirname(filePath),
      {
        recursive: true,
      },
    );

    fs.writeFileSync(
      filePath,
      content,
      "utf-8",
    );
  }

  return tempProject;
}

function cleanup(): void {
  if (tempProject) {
    fs.rmSync(tempProject, {
      recursive: true,
      force: true,
    });

    tempProject = null;
  }
}

afterEach(() => {
  cleanup();
});

describe("analyzeDependencies", () => {
  it("detects a used production dependency", () => {
    const project = createTempProject({
      "src/index.ts": `
        import chalk from "chalk";

        console.log(chalk.green("Hello"));
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {
        chalk: "^5.0.0",
      },
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.unusedDependencies,
    ).not.toContain("chalk");
  });

  it("detects an unused production dependency", () => {
    const project = createTempProject({
      "src/index.ts": `
        console.log("Hello");
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {
        chalk: "^5.0.0",
      },
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.unusedDependencies,
    ).toContain("chalk");
  });

  it("detects a used devDependency", () => {
    const project = createTempProject({
      "src/index.ts": `
        console.log("Hello");
      `,
      "package.json": JSON.stringify({
        scripts: {
          test: "vitest",
        },
      }),
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {},
      {
        vitest: "^5.0.0",
      },
    );

    process.chdir(originalCwd);

    expect(
      result.unusedDevDependencies,
    ).not.toContain("vitest");
  });

  it("detects an unused devDependency", () => {
    const project = createTempProject({
      "src/index.ts": `
        console.log("Hello");
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {},
      {
        vitest: "^5.0.0",
      },
    );

    process.chdir(originalCwd);

    expect(
      result.unusedDevDependencies,
    ).toContain("vitest");
  });

  it("detects missing dependencies", () => {
    const project = createTempProject({
      "src/index.ts": `
        import express from "express";

        console.log(express);
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {},
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.missingDependencies,
    ).toContain("express");
  });

  it("handles scoped packages", () => {
    const project = createTempProject({
      "src/index.ts": `
        import chalk from "@scope/test-package";

        console.log(chalk);
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {
        "@scope/test-package": "^1.0.0",
      },
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.unusedDependencies,
    ).not.toContain(
      "@scope/test-package",
    );
  });

  it("ignores Node.js built-in modules", () => {
    const project = createTempProject({
      "src/index.ts": `
        import fs from "node:fs";

        console.log(fs);
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {},
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.missingDependencies,
    ).not.toContain("node:fs");
  });

  it("ignores relative imports", () => {
    const project = createTempProject({
      "src/index.ts": `
        import helper from "./helper.js";

        console.log(helper);
      `,
      "src/helper.ts": `
        export default "hello";
      `,
    });

    const originalCwd = process.cwd();

    process.chdir(project);

    const result = analyzeDependencies(
      {},
      {},
    );

    process.chdir(originalCwd);

    expect(
      result.missingDependencies,
    ).toHaveLength(0);
  });
});

