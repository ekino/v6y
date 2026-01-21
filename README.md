# Vitality (v6y)

![image](https://github.com/ekino/v6y/assets/1331451/60950262-3a75-4a57-ae53-08a9d553f1f8)

**Vitality (v6y)** is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases and applications. While it is primarily used for Ekino projects, it can also be generalized for use by the wider development community.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)
6. [Security Scanning](#security-scanning)
   - [Configuration](#configuration)
   - [Local Testing](#local-testing)

## Introduction
**Vitality (v6y)** helps developers ensure high-quality code and robust applications by providing continuous health checks, detailed reports, and actionable insights. Although it was developed for Ekino projects, it is versatile and can be used by any development team.

## Features
- **Code Quality Analysis**: Runs static analysis to detect issues in your code.
- **Runtime Monitoring**: Monitors applications in real-time to catch errors and performance issues.
- **Comprehensive Reports**: Generates detailed reports with insights and recommendations for improving code health.
- **User-friendly Dashboard**: Offers an intuitive dashboard for monitoring the health status of all your projects at a glance.

## Usage
To use **Vitality (v6y)**, follow these steps:

1. Access the application online at [Vitality (v6y) Web App](http://your-vitality-app-url.com).

2. Create an account or log in using your existing credentials.

3. Add your projects to the dashboard to start monitoring their health and performance.

4. Use the dashboard to view real-time data and detailed reports on the health of your codebases and applications.

## Contributing
We welcome contributions to **Vitality (v6y)**. To contribute, please read our guidelines outlined in the project [Wiki](https://github.com/ekino/v6y/wiki).

## License
**Vitality (v6y)** is licensed under the MIT License. See the `LICENSE` file for more details.

## Security Scanning
This project uses Snyk for security scanning to identify and remediate vulnerabilities in its dependencies and code. Snyk scans are configured to run automatically on every push and pull request to the repository via GitHub Actions.

To interpret the Snyk scan results, developers should check the GitHub Actions logs for the "Run Snyk scan" step. Any alerts or vulnerabilities detected by Snyk will be reported in these logs. It is important to review these alerts and address any critical or high-severity vulnerabilities promptly.

### Configuration
The Snyk integration relies on a GitHub secret named `SNYK_TOKEN` to authenticate with the Snyk API. You need to create this secret in your repository settings.

To add the `SNYK_TOKEN` secret:
1. Go to your repository on GitHub.
2. Click on "Settings" > "Secrets and variables" > "Actions".
3. Click on "New repository secret".
4. Enter `SNYK_TOKEN` as the name of the secret.
5. Paste your Snyk API token as the value of the secret. You can find your API token on your Snyk account page.
6. Click "Add secret".

For more detailed instructions on creating encrypted secrets, refer to the [GitHub documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

### Local Testing
You can also run Snyk scans locally to test for vulnerabilities before pushing your code.

1.  **Install Snyk CLI**: If you haven't already (e.g., through project setup or if you're not using the GitHub Action primarily), install the Snyk CLI globally:
    ```bash
    pnpm add -g snyk
    ```
2.  **Authenticate**: Log in to your Snyk account. This will open a browser window for authentication.
    ```bash
    snyk auth
    ```
3.  **Navigate to Project Root**: Open your terminal and go to the root directory of this project.
    ```bash
    cd path/to/your/project
    ```
4.  **Run Scan**: To scan all projects within this monorepo:
    ```bash
    snyk test --all-projects
    ```
5.  **(Optional) Target Specific Projects**: To scan a specific package or project within the monorepo, navigate to its subdirectory and run `snyk test`:
    ```bash
    cd packages/your-specific-package
    snyk test
    ```

For more advanced commands, options, and information on how to interpret the results in detail, please refer to the [official Snyk CLI documentation](https://docs.snyk.io/snyk-cli).
