#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";

import {
  getAvailableFixes,
  runFix,
  type FixResult,
} from "./fixers.js";

import { analyzeProject } from "./analyzers/project.js";
import { analyzePackage } from "./analyzers/package.js";
import { analyzeDependencies } from "./analyzers/dependencies.js";
import { analyzeSecurity } from "./analyzers/security.js";
import { calculateHealth } from "./analyzers/health.js";
import { runProjectChecks } from "./analyzers/checks.js";
import { analyzeTechnology } from "./analyzers/technology.js";

import { generateRecommendations } from "./recommendations.js";

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
  .action(async (options) => {
    // --------------------------------
    // Project analysis
    // --------------------------------

    const project = analyzeProject();

    // --------------------------------
    // Apply safe fixes
    // --------------------------------

    let fixResults: FixResult[] = [];

    if (options.fix) {
      const availableFixes = getAvailableFixes();

      // No fixes available
      if (availableFixes.length === 0) {
        if (!options.json) {
          console.log("🔧 Fixes");
          console.log("   ✓ No safe fixes available");
          console.log();
        }
      }

      // JSON mode
      else if (options.json) {
        // Never show interactive prompts in JSON mode.
        fixResults = availableFixes.map((fix) => runFix(fix));
      }

      // Interactive terminal mode
      else {
        console.log("🔧 Safe Fixes\n");

        const answer = await inquirer.prompt<{
          fixes: string[];
        }>([
          {
            type: "checkbox",
            name: "fixes",
            message: "Select fixes to apply:",
            choices: availableFixes.map((fix) => ({
              name: fix,
              value: fix,
              checked: true,
            })),
          },
        ]);

        if (answer.fixes.length === 0) {
          console.log("\n   ℹ No fixes selected\n");
        } else {
          console.log("\n🔧 Applying fixes...\n");

          for (const fix of answer.fixes) {
            const result = runFix(fix);

            fixResults.push(result);

            if (result.fixed) {
              console.log(`   ✓ ${result.message}`);
            } else {
              console.log(`   ℹ ${result.message}`);
            }
          }

          console.log();
        }
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
    // Recommendations
    // --------------------------------

    const recommendations = generateRecommendations({
      projectChecks,

      unusedDependencies:
        dependencyAnalysis.unusedDependencies,

      unusedDevDependencies:
        dependencyAnalysis.unusedDevDependencies,

      vulnerabilities:
        securityAnalysis.vulnerabilities,

      healthScore: health.score,
    });

    // --------------------------------
    // Report data
    // --------------------------------

    const reportData = {
      project,
      packageJson,
      technology,
      projectChecks,
      dependencyAnalysis,
      securityAnalysis,
      health,
      recommendations,
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

// --------------------------------
// Start CLI
// --------------------------------

program.parse();