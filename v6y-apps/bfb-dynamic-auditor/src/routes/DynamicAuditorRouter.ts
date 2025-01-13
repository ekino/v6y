import { AppLogger } from '@v6y/core-logic';
import express from 'express';

import DynamicAuditorManager from '../auditors/DynamicAuditorManager.ts';

const { Router } = express;

const DynamicAuditorRouter: express.Router = Router();

DynamicAuditorRouter.post('/start-dynamic-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[DynamicAuditorApiPath] Entering service: [start-dynamic-auditor]');

        const { applicationId } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await DynamicAuditorManager.startDynamicAudit({
            applicationId,
        }); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'Dynamic Audits have end successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the Dynamic Audits.',
            });
        }
    } catch (error) {
        AppLogger.error(
            '[DynamicAuditorApiPath] An exception occurred during the Dynamic Audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the Dynamic Audits.',
        });
    }
});

export default DynamicAuditorRouter;
