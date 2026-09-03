import fs from "node:fs";
import path from "node:path";

export interface FixResult {
  name: string;
  fixed: boolean;
  message: string;
}

export function getAvailableFixes(): string[] {
  const projectPath = process.cwd();

  const fixes: string[] = [];

  const readmePath = path.join(projectPath, "README.md");

  if (!fs.existsSync(readmePath)) {
    fixes.push("README");
  }

  const gitignorePath = path.join(projectPath, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    fixes.push(".gitignore");
  }

  return fixes;
}

export function runFix(
  fixName: string,
): FixResult {
  const projectPath = process.cwd();

  // --------------------------------
  // README
  // --------------------------------

  if (fixName === "README") {
    const readmePath = path.join(
      projectPath,
      "README.md",
    );

    if (fs.existsSync(readmePath)) {
      return {
        name: "README",
        fixed: false,
        message: "README.md already exists",
      };
    }

    fs.writeFileSync(
      readmePath,
      "# Project\n\nThis project was analyzed by Project Doctor.\n",
    );

    return {
      name: "README",
      fixed: true,
      message: "Created README.md",
    };
  }

  // --------------------------------
  // .gitignore
  // --------------------------------

  if (fixName === ".gitignore") {
    const gitignorePath = path.join(
      projectPath,
      ".gitignore",
    );

    if (fs.existsSync(gitignorePath)) {
      return {
        name: ".gitignore",
        fixed: false,
        message: ".gitignore already exists",
      };
    }

    fs.writeFileSync(
      gitignorePath,
      "node_modules/\ndist/\n.env\n.DS_Store\n",
    );

    return {
      name: ".gitignore",
      fixed: true,
      message: "Created .gitignore",
    };
  }

  return {
    name: fixName,
    fixed: false,
    message: `Unknown fix: ${fixName}`,
  };
}

export function runFixes(): FixResult[] {
  const availableFixes = getAvailableFixes();

  return availableFixes.map((fix) =>
    runFix(fix),
  );
}

