import { Matcher } from '@v6y/core-logic/src/utils';
import { Descriptions } from '@v6y/ui-kit';
import * as React from 'react';

import VitalityTerms from '../../config/VitalityTerms';
import { VitalityModuleType } from '../../types/VitalityModulesProps';

const VitalityHelpView = ({ module }: { module: VitalityModuleType }) => {
    const moduleHelp = Matcher()
        .on(
            () => module?.auditHelp && Object.keys(module?.auditHelp).length > 0,
            () => module?.auditHelp,
        )
        .on(
            () => module?.statusHelp && Object.keys(module?.statusHelp).length > 0,
            () => module?.statusHelp,
        )
        .on(
            () => module?.evolutionHelp && Object.keys(module?.evolutionHelp).length > 0,
            () => module?.evolutionHelp,
        )
        .otherwise(() => ({})) as Record<string, string>;

    return (
        <Descriptions
            bordered
            size="middle"
            column={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 2,
                xxl: 2,
            }}
        >
            {moduleHelp?.category?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL}
                    span={2}
                >
                    {moduleHelp.category}
                </Descriptions.Item>
            )}
            {moduleHelp?.title?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_TITLE_LABEL}
                    span={2}
                >
                    {moduleHelp.title}
                </Descriptions.Item>
            )}
            {moduleHelp?.description?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_DESCRIPTION_LABEL}
                    span={2}
                >
                    {moduleHelp.description}
                </Descriptions.Item>
            )}
            {moduleHelp?.explanation?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_EXPLANATION_LABEL}
                    span={2}
                >
                    {moduleHelp.explanation}
                </Descriptions.Item>
            )}
            {module?.branch?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCH_LABEL}
                    span={3}
                >
                    {module?.branch}
                </Descriptions.Item>
            )}
            {module?.path?.length > 0 && (
                <Descriptions.Item
                    label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_PATH_LABEL}
                    span={3}
                >
                    {module?.path}
                </Descriptions.Item>
            )}
        </Descriptions>
    );
};

export default VitalityHelpView;
