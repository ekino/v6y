import { AppLogger } from '@v6y/commons';
import express from 'express';

import FrontendAuditorManager from '../auditors/FrontendAuditorManager.js';

const { Router } = express;

const FrontendAuditorRouter = Router();

FrontendAuditorRouter.post('/start-frontend-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[FrontendAuditorRouter] Entering service: [start-auditor]');

        const { applicationId, workspaceFolder } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await FrontendAuditorManager.startFrontendAudit({
            applicationId,
            workspaceFolder,
        }); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'Frontend audits have end successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the Frontend audits.',
            });
        }
    } catch (error) {
        AppLogger.error(
            '[FrontendAuditorRouter] An exception occurred during the Frontend audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the Frontend audits.',
        });
    }
});

export default FrontendAuditorRouter;
