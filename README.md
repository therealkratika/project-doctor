# 🩺 Project Doctor

Project Doctor is a CLI tool that analyzes a JavaScript/TypeScript project and gives it a **health score**, detects common project issues, analyzes dependencies, checks security, and provides recommendations.

## ✨ Features

* 📁 Project structure analysis
* 🧩 Technology/framework detection
* 📦 Dependency analysis
* ⚠️ Potentially unused dependency detection
* ❌ Missing dependency detection
* 🔐 Security vulnerability checking
* 📋 Project health checks
* 🧪 Test configuration detection
* 🔍 Linting configuration detection
* 📝 README and `.gitignore` checks
* 🌿 Git repository detection
* 📦 Package manager lockfile detection
* ❤️ Project health score
* 💡 Recommendations
* 🔧 Safe automatic fixes
* 📊 JSON output for automation

---

## 🚀 Installation

### Option 1 — Install from npm

Once Project Doctor is published to npm, anyone can install it globally:

```bash
npm install -g project-doctor
```

Then run:

```bash
project-doctor doctor
```

---

## 💻 Using Project Doctor on Your Own Project

You **do not need to copy Project Doctor into your project**.

First, go to the project you want to analyze:

```bash
cd path/to/your-project
```

Then run:

```bash
project-doctor doctor
```

For example:

```bash
cd my-react-app
project-doctor doctor
```

Project Doctor will analyze the current directory.

Example output:

```text
🩺 PROJECT DOCTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Project
   Name: my-react-app
   Path: /Users/you/Desktop/my-react-app

🧩 Technology
   Framework: React
   Language: TypeScript
   Styling: Tailwind CSS
   Database: Unknown
   ORM: None

📦 Dependencies
   Production: 5
   Development: 8

📋 Project Checks
   ✓ package.json found
   ✓ README.md found
   ✓ .gitignore found
   ✓ Git repository detected
   ✓ package-lock.json found
   ✓ Test script found
   ✓ Linting configuration found
   ✓ TypeScript configuration found

🔐 Security
   ✓ No vulnerabilities detected

❤️ Health Score
   98/100 — Excellent
```

---

## 📥 Installing Directly from GitHub

If Project Doctor has not been published to npm, users can clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/project-doctor.git
```

Move into the project:

```bash
cd project-doctor
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Then use the CLI:

```bash
node dist/index.js doctor
```

### Analyze another project

From the Project Doctor directory, run:

```bash
node dist/index.js doctor /path/to/your-project
```

If the current version only analyzes the current working directory, use:

```bash
cd /path/to/your-project
node /path/to/project-doctor/dist/index.js doctor
```

For example:

```bash
cd ~/Desktop/my-project
node ~/Desktop/project-doctor/dist/index.js doctor
```

---

## 🔧 Automatic Fixes

Project Doctor can apply safe fixes using:

```bash
project-doctor doctor --fix
```

If installed from source:

```bash
node dist/index.js doctor --fix
```

Project Doctor will show the available safe fixes and allow you to select which ones to apply.

---

## 📊 JSON Output

Project Doctor supports JSON output for scripts, CI/CD pipelines, and other tools.

```bash
project-doctor doctor --json
```

You can also combine JSON output with safe fixes:

```bash
project-doctor doctor --fix --json
```

Example:

```json
{
  "project": {
    "projectName": "my-project"
  },
  "health": {
    "score": 95,
    "status": "Excellent"
  }
}
```

---

## 🧪 Development

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/project-doctor.git
cd project-doctor
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run Project Doctor locally:

```bash
node dist/index.js doctor
```

---

## 🏗️ Project Structure

```text
project-doctor/
├── src/
│   ├── analyzers/
│   │   ├── checks.ts
│   │   ├── dependencies.ts
│   │   ├── health.ts
│   │   ├── package.ts
│   │   ├── project.ts
│   │   ├── security.ts
│   │   └── technology.ts
│   ├── fixers.ts
│   ├── index.ts
│   ├── json-reporter.ts
│   ├── recommendations.ts
│   └── reporter.ts
├── tests/
│   └── health.test.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── .gitignore
```

---

## 🩺 What Project Doctor Checks

### Project

* `package.json`
* `README.md`
* `.gitignore`
* Git repository
* Package manager lockfile
* Test configuration
* Linting configuration
* TypeScript configuration
* `.env` Git safety

### Technology

Project Doctor detects technologies such as:

* React
* Next.js
* Vue
* Nuxt
* Angular
* Svelte
* SvelteKit
* Express
* NestJS
* TypeScript
* Tailwind CSS
* Sass
* styled-components
* Emotion
* MongoDB
* PostgreSQL
* MySQL
* SQLite
* Redis
* Prisma
* Sequelize
* TypeORM
* Drizzle
* Mongoose

### Dependencies

Project Doctor checks for:

* Potentially unused dependencies
* Potentially unused development dependencies
* Missing dependencies

> Dependency analysis is heuristic-based and should be reviewed before removing packages.

### Security

Project Doctor checks your project's npm dependencies for known vulnerabilities.

---

## ❤️ Health Score

The health score gives your project an overall indication of its current condition.

| Score  | Status            |
| ------ | ----------------- |
| 90–100 | Excellent         |
| 75–89  | Good              |
| 50–74  | Needs Improvement |
| 0–49   | Poor              |

The score considers factors such as:

* Project checks
* Unused dependencies
* Missing dependencies
* Security vulnerabilities

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch:

```bash
git checkout -b feature/my-feature
```

3. Make your changes
4. Run the tests:

```bash
npm test
```

5. Build the project:

```bash
npm run build
```

6. Commit your changes:

```bash
git commit -m "feat: add my feature"
```

7. Push your branch:

```bash
git push origin feature/my-feature
```

8. Open a Pull Request

---

## 📄 License

Add your project's license information here.

---

## 🩺 Why Project Doctor?

Before deploying or sharing a project, it's useful to know whether the project has obvious configuration, dependency, security, and maintenance issues.

Project Doctor provides a quick health check directly from your terminal.

```text
🩺 Diagnose → 🔍 Analyze → ❤️ Score → 💡 Improve
```
