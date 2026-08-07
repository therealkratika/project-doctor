#!/usr/bin/env node

import { Command } from "commander";

import { runFixes, type FixResult } from "./fixers.js";
import { analyzeProject } from "./analyzers/project.js";
import { analyzePackage } from "./analyzers/package.js";
import { analyzeDependencies } from "./analyzers/dependencies.js";
import { analyzeSecurity } from "./analyzers/security.js";
import { calculateHealth } from "./analyzers/health.js";
import { runProjectChecks } from "./analyzers/checks.js";
import { analyzeTechnology } from "./analyzers/technology.js";

import { printReport } from "./reporter.js";
import { printJsonReport } from "./json-reporter.js";

const program = new Command();

program
  .name("project-doctor")
  .description("A CLI tool that analyzes your projects")
  .version("1.0.0");

program
  .command("doctor")
  .description("Check the health of your project")
  .option("--json", "Output results as JSON")
  .option("--fix", "Automatically fix safe issues")
  .action((options) => {
    // --------------------------------
    // Project analysis
    // --------------------------------

    const project = analyzeProject();

    // --------------------------------
    // Apply safe fixes
    // --------------------------------

    let fixResults: FixResult[] = [];

    if (options.fix) {
      fixResults = runFixes();

      // Don't print fix messages when
      // JSON output is requested.
      if (!options.json) {
        console.log("🔧 Applying safe fixes...\n");

        for (const fix of fixResults) {
          if (fix.fixed) {
            console.log(`   ✓ ${fix.message}`);
          } else {
            console.log(`   ℹ ${fix.message}`);
          }
        }

        console.log();
      }
    }

    // --------------------------------
    // Package analysis
    // --------------------------------

    const packageJson = analyzePackage();

    if (!packageJson) {
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              project,
              packageJson: null,
              error: "No package.json found",
              fixes: fixResults,
            },
            null,
            2,
          ),
        );
      } else {
        console.log("⚠️ No package.json found");
      }

      return;
    }

    // --------------------------------
    // Technology analysis
    // --------------------------------

    const technology = analyzeTechnology(
      packageJson.dependencies,
      packageJson.devDependencies,
    );

    // --------------------------------
    // Project checks
    // --------------------------------

    const projectChecks = runProjectChecks();

    // --------------------------------
    // Dependency analysis
    // --------------------------------

    const dependencyAnalysis = analyzeDependencies(
      packageJson.dependencies,
      packageJson.devDependencies,
    );

    // --------------------------------
    // Security analysis
    // --------------------------------

    const securityAnalysis = analyzeSecurity();

    // --------------------------------
    // Health calculation
    // --------------------------------

    const failedChecks = projectChecks.filter(
      (check) => !check.passed,
    ).length;

    const health = calculateHealth({
      unusedDependencies:
        dependencyAnalysis.unusedDependencies.length,

      unusedDevDependencies:
        dependencyAnalysis.unusedDevDependencies.length,

      vulnerabilities:
        securityAnalysis.vulnerabilities,

      failedChecks,
    });

    // --------------------------------
    // Collect report data
    // --------------------------------

    const reportData = {
      project,
      packageJson,
      technology,
      projectChecks,
      dependencyAnalysis,
      securityAnalysis,
      health,
      fixes: fixResults,
    };

    // --------------------------------
    // Generate report
    // --------------------------------

    if (options.json) {
      printJsonReport(reportData);
    } else {
      printReport(reportData);
    }
  });

program.parse();

