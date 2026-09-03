export function printJsonReport(data) {
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
            production: Object.keys(data.packageJson.dependencies).length,
            development: Object.keys(data.packageJson.devDependencies).length,
            unused: data.dependencyAnalysis.unusedDependencies,
            unusedDev: data.dependencyAnalysis
                .unusedDevDependencies,
        },
        checks: data.projectChecks,
        security: data.securityAnalysis,
        health: data.health,
    };
    console.log(JSON.stringify(report, null, 2));
}
