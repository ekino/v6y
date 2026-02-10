import * as React from 'react';
import { useEffect, useState } from 'react';

import { AuditType } from '@v6y/core-logic/src/types/AuditType';
import {
    DynamicLoader,
    List,
    ModalView,
    PaginatedList,
    TitleView,
    useTranslationProvider,
} from '@v6y/ui-kit';

import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';
import VitalityLighthouseReportItem from './VitalityLighthouseReportItem';

const VitalityHelpView = DynamicLoader(
    () => import('../../../../../../commons/components/help/VitalityHelpView'),
);

const VitalityLighthouseReportsCategoryGrouper = ({ reports }: { reports: AuditType[] }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState<VitalityModuleType>();

    const { groupedDataSource } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    useEffect(() => {
        if (Object.keys(helpDetails || {})?.length > 0) {
            setIsHelpModalOpen(true);
        } else {
            setIsHelpModalOpen(false);
        }
    }, [helpDetails]);

    const { translate } = useTranslationProvider();

    return (
        <>
            <PaginatedList
                pageSize={15}
                grid={{ gutter: 4, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
                dataSource={Object.keys(groupedDataSource || {})}
                renderItem={(item) => {
                    const report = groupedDataSource[item as string][0] as AuditType;
                    return (
                        <List.Item>
                            <VitalityLighthouseReportItem
                                report={report}
                                onOpenHelpClicked={setHelpDetails}
                            />
                        </List.Item>
                    );
                }}
            />
            <ModalView
                title={
                    <TitleView
                        title={translate('vitality.appDetailsPage.audit.moduleHelpTitle')}
                        level={5}
                    />
                }
                onCloseModal={() => setHelpDetails(undefined)}
                isOpen={isHelpModalOpen}
            >
                <VitalityHelpView module={helpDetails as VitalityModuleType} />
            </ModalView>
        </>
    );
};

export default VitalityLighthouseReportsCategoryGrouper;
