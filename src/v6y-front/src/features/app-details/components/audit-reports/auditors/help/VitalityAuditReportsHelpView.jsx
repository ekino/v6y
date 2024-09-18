import { Typography } from 'antd';
import React from 'react';

import VitalityModal from '../../../../../../commons/components/VitalityModal.jsx';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms.js';

const VitalityAuditReportsHelpView = ({ reports, isOpen, onClose }) => {
    return (
        <VitalityModal
            title={
                <Typography.Title level={5}>
                    {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_TITLE}
                </Typography.Title>
            }
            isOpen={isOpen}
            onCloseModal={onClose}
        >
            cccc
        </VitalityModal>
    );
};

export default VitalityAuditReportsHelpView;
