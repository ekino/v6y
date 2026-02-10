import * as React from 'react';
import { useEffect, useState } from 'react';

import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';
import DynamicLoader from '@v6y/ui-kit/components/organisms/app/DynamicLoader.tsx';
import ModalView from '@v6y/ui-kit/components/organisms/app/ModalView.tsx';
import PaginatedList from '@v6y/ui-kit/components/organisms/app/PaginatedList.tsx';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView.tsx';

import { VitalityModuleType, VitalityModulesProps } from '../../types/VitalityModulesProps';
import VitalityModuleListItem from './VitalityModuleListItem';

const VitalityHelpView = DynamicLoader(() => import('../help/VitalityHelpView'));

const VitalityModuleList = ({ modules }: VitalityModulesProps) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState<VitalityModuleType>();
    const { translate } = useTranslationProvider();

    useEffect(() => {
        if (Object.keys(helpDetails || {})?.length > 0) {
            setIsHelpModalOpen(true);
        } else {
            setIsHelpModalOpen(false);
        }
    }, [helpDetails]);

    return (
        <>
            <PaginatedList
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
                {helpDetails && <VitalityHelpView module={helpDetails} />}
            </ModalView>
        </>
    );
};

export default VitalityModuleList;
