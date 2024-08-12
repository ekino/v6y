import express from 'express';
import { AppLogger } from '@v6y/commons';
import AppAuditorManager from '../auditors/AppAuditorManager.js';

const { startAudits } = AppAuditorManager;
const { Router } = express;

const AppAuditorRouter = Router();

AppAuditorRouter.get('/start-auditor.json', async (request, response) => {
    try {
        AppLogger.debug('[AppAuditorRouter] Entering service: [start-auditor]');

        // ********************************************** Start Audits ***********************************************
        const auditsStartedSuccessfully = await startAudits(); // Wait for audits to potentially complete

        // ********************************************** Server Response ***********************************************
        if (auditsStartedSuccessfully) {
            response.status(200).json({
                success: true,
                message: 'App audits have started successfully!',
            });
        } else {
            response.status(500).json({
                // Use 500 for internal server error
                success: false,
                message: 'An error occurred while starting the app audits.',
            });
        }
    } catch (error) {
        AppLogger.error('[AppAuditorRouter] An exception occurred during the app audits:', error);
        response.status(500).json({
            // Use 500 for internal server error
            success: false,
            message: 'An error occurred during the app audits.',
        });
    }
});

export default AppAuditorRouter;
