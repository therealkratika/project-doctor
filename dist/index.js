#!/usr/bin/env node
import { Command } from "commander";
import { runFixes } from "./fixers.js";
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
    if (options.fix) {
        const fixes = runFixes();
        console.log("🔧 Applying safe fixes...\n");
        for (const fix of fixes) {
            if (fix.fixed) {
                console.log(`   ✓ ${fix.message}`);
            }
            else {
                console.log(`   ℹ ${fix.message}`);
            }
        }
        console.log();
    }
    // --------------------------------
    // Package analysis
    // --------------------------------
    const packageJson = analyzePackage();
    if (!packageJson) {
        console.log("⚠️ No package.json found");
        return;
    }
    // --------------------------------
    // Technology analysis
    // --------------------------------
    const technology = analyzeTechnology(packageJson.dependencies, packageJson.devDependencies);
    // --------------------------------
    // Project checks
    // --------------------------------
    const projectChecks = runProjectChecks();
    // --------------------------------
    // Dependency analysis
    // --------------------------------
    const dependencyAnalysis = analyzeDependencies(packageJson.dependencies, packageJson.devDependencies);
    // --------------------------------
    // Security analysis
    // --------------------------------
    const securityAnalysis = analyzeSecurity();
    // --------------------------------
    // Health calculation
    // --------------------------------
    const health = calculateHealth({
        unusedDependencies: dependencyAnalysis.unusedDependencies.length,
        unusedDevDependencies: dependencyAnalysis.unusedDevDependencies.length,
        vulnerabilities: securityAnalysis.vulnerabilities,
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
    };
    // --------------------------------
    // Generate report
    // --------------------------------
    if (options.json) {
        printJsonReport(reportData);
    }
    else {
        printReport(reportData);
    }
});
program.parse();
