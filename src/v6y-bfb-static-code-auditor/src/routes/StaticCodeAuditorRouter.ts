import { AppLogger } from '@v6y/commons';
import express from 'express';

import StaticCodeAuditorManager from '../auditors/StaticCodeAuditorManager.ts';

const { Router } = express;

const StaticCodeAuditorRouter: express.Router = Router();

StaticCodeAuditorRouter.post('/start-static-code-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[StaticCodeAuditorRouter] Entering service: [start-static-code-auditor]');

        const { applicationId, workspaceFolder } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await StaticCodeAuditorManager.startStaticCodeAudit({
            applicationId,
            workspaceFolder,
        }); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'Static Code Audits have end successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the Static Code Audits.',
            });
        }
    } catch (error) {
        AppLogger.error(
            '[StaticCodeAuditorRouter] An exception occurred during the Static Code Audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the Static Code Audits.',
        });
    }
});

export default StaticCodeAuditorRouter;
