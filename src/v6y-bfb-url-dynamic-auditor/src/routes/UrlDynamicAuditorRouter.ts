import { AppLogger } from '@v6y/commons';
import express from 'express';

import UrlDynamicAuditorManager from '../auditors/UrlDynamicAuditorManager.ts';

const { Router } = express;

const UrlDynamicAuditorRouter: express.Router = Router();

UrlDynamicAuditorRouter.post('/start-url-dynamic-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[UrlDynamicAuditorRouter] Entering service: [start-url-dynamic-auditor]');

        const { applicationId } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await UrlDynamicAuditorManager.startUrlDynamicAudit({
            applicationId,
        }); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'Url Dynamic Audits have end successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the Url Dynamic Audits.',
            });
        }
    } catch (error) {
        AppLogger.error(
            '[UrlDynamicAuditorRouter] An exception occurred during the Url Dynamic Audits:',
            error,
        );
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the Url Dynamic Audits.',
        });
    }
});

export default UrlDynamicAuditorRouter;
