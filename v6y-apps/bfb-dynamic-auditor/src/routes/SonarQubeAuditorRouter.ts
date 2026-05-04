import express from 'express';

import { AppLogger } from '@v6y/core-logic';

import SonarQubeAuditorManager from '../auditors/SonarQubeAuditorManager.ts';

const { Router } = express;

const SonarQubeAuditorRouter: express.Router = Router();

SonarQubeAuditorRouter.post('/get-sonarqube-metrics.json', async (request, response) => {
    try {
        AppLogger.debug('[SonarQubeAuditorRouter] Entering service: [get-sonarqube-metrics]');

        const { sonarUrl, token } = request.body || {};

        AppLogger.info(`[SonarQubeAuditorRouter] sonarUrl: ${sonarUrl}`);

        if (!sonarUrl) {
            AppLogger.error(
                '[SonarQubeAuditorRouter] sonarUrl is required to fetch SonarQube metrics.',
            );
            response.status(400).json({
                success: false,
                error: 'sonarUrl is required to fetch SonarQube metrics.',
            });
            return;
        }

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({ sonarUrl, token });

        response.status(200).json(result);
    } catch (error) {
        AppLogger.error(
            '[SonarQubeAuditorRouter] An exception occurred while fetching SonarQube metrics:',
            error,
        );
        response.status(500).json({
            success: false,
            error: 'An error occurred while fetching SonarQube metrics.',
        });
    }
});

export default SonarQubeAuditorRouter;
