'use client';

import React from 'react';
import CommonsDico from '../../commons/dico/CommonsDico.js';
import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';

const VitalityAppDetailsView = () => {
    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_APP_DETAILS_PAGE_TITLE}>
            VitalityAppDetails
        </VitalityPageLayout>
    );
};

export default VitalityAppDetailsView;
