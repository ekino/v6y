import { AppLogger } from '@v6y/commons';
import express from 'express';

import FrontendDynamicStatusAuditorManager from '../auditors/FrontendDynamicStatusAuditorManager.js';
import FrontendStaticStatusAuditorManager from '../auditors/FrontendStaticStatusAuditorManager.js';

const { Router } = express;

const FrontendAuditorRouter = Router();

FrontendAuditorRouter.post('/start-frontend-static-auditor.json', async (request, response) => {
    try {
        AppLogger.debug(
            '[FrontendAuditorRouter] Entering service: [start-frontend-static-auditor]',
        );

        const { applicationId, workspaceFolder } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully =
            await FrontendStaticStatusAuditorManager.startFrontendStaticAudit({
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

FrontendAuditorRouter.post('/start-frontend-dynamic-auditor.json', async (request, response) => {
    try {
        AppLogger.debug(
            '[FrontendAuditorRouter] Entering service: [start-frontend-dynamic-auditor]',
        );

        const { applicationId } = request.body || {};

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully =
            await FrontendDynamicStatusAuditorManager.startFrontendDynamicAudit({
                applicationId,
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
