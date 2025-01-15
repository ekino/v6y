import { AppLogger } from '@v6y/core-logic';
import express from 'express';

import DevOpsAuditorManager from '../auditors/DevOpsAuditorManager.ts';

const { Router } = express;

const DevOpsAuditorRouter: express.Router = Router();

DevOpsAuditorRouter.post('/start-devops-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[DevOpsAuditorRouter] Entering service: [start-devops-auditor]');

        const { applicationId } = request.body || {};

        // ********************************************** Input Validation ***********************************************
        AppLogger.info(`[DevOpsAuditorRouter] applicationId: ${applicationId}`);

        if (!applicationId) {
            AppLogger.error(
                '[DevOpsAuditorRouter] The applicationId is required to start the DevOps Audits.',
            );
            response.status(400).json({
                // Use 400 for bad request
                success: false,
                message: 'The applicationId is required to start the DevOps Audits.',
            });
            return;
        }

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await DevOpsAuditorManager.startDevOpsAudit({
            applicationId,
        }); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'DevOps Audits have end successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the DevOps Audits.',
            });
        }
    } catch (error) {
        AppLogger.error(
            '[DevOpsAuditorRouter] An exception occurred during the DevOps Audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the DevOps Audits.',
        });
    }
});

export default DevOpsAuditorRouter;
