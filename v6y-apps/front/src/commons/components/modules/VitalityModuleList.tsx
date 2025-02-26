import {
    VitalityDynamicLoader,
    VitalityModal,
    VitalityPaginatedList,
    VitalityTitle,
} from '@v6y/shared-ui';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityTerms from '../../config/VitalityTerms';
import { VitalityModuleType, VitalityModulesProps } from '../../types/VitalityModulesProps';
import VitalityModuleListItem from './VitalityModuleListItem';

const VitalityHelpView = VitalityDynamicLoader(() => import('../help/VitalityHelpView'));

const VitalityModuleList = ({ modules }: VitalityModulesProps) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState<VitalityModuleType>();

    useEffect(() => {
        if (Object.keys(helpDetails || {})?.length > 0) {
            setIsHelpModalOpen(true);
        } else {
            setIsHelpModalOpen(false);
        }
    }, [helpDetails]);

    return (
        <>
            <VitalityPaginatedList
                style={{ paddingTop: '2rem', marginTop: '2rem' }}
                pageSize={15}
                grid={{ gutter: 4, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
                dataSource={modules}
                renderItem={(item: unknown) => (
                    <VitalityModuleListItem
                        module={item as VitalityModuleType}
                        onModuleClicked={setHelpDetails}
                    />
                )}
            />
            <VitalityModal
                title={
                    <VitalityTitle
                        title={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_MODULE_HELP_TITLE}
                        level={5}
                    />
                }
                onCloseModal={() => setHelpDetails(undefined)}
                isOpen={isHelpModalOpen}
            >
                {helpDetails && <VitalityHelpView module={helpDetails} />}
            </VitalityModal>
        </>
    );
};

export default VitalityModuleList;
