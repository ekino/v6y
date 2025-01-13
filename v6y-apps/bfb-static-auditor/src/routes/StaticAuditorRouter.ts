import { AppLogger } from '@v6y/core-logic';
import express from 'express';

import StaticAuditorManager from '../auditors/StaticAuditorManager.ts';

const { Router } = express;

const StaticAuditorRouter: express.Router = Router();

StaticAuditorRouter.post('/start-static-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[StaticAuditorRouter] Entering service: [start-static-auditor]');

        const { applicationId, workspaceFolder } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await StaticAuditorManager.startStaticAudit({
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
            '[StaticAuditorRouter] An exception occurred during the Static Code Audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the Static Code Audits.',
        });
    }
});

export default StaticAuditorRouter;
