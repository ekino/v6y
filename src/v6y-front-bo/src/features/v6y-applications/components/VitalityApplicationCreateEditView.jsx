import { Typography } from 'antd';
import React from 'react';

import VitalityInputFieldSet from '../../../commons/components/VitalityInputFieldSet.jsx';
import {
    applicationInfosFormItems,
    applicationOptionalLinksFormItems,
    applicationRequiredLinksFormItems,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper.jsx';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditApplication from '../apis/createOrEditApplication.js';

const VitalityApplicationCreateEditItems = (translate, application) => [
    <VitalityInputFieldSet
        key={translate('v6y-applications.fields.app-infos-group')}
        groupTitle={translate('v6y-applications.fields.app-infos-group')}
        items={applicationInfosFormItems(translate, application)}
    />,
    <VitalityInputFieldSet
        key={translate('v6y-applications.fields.app-required-link-group')}
        groupTitle={translate('v6y-applications.fields.app-required-link-group')}
        items={applicationRequiredLinksFormItems(translate, application)}
    />,
    <VitalityInputFieldSet
        key={translate('v6y-applications.fields.app-optional-link-group')}
        groupTitle={translate('v6y-applications.fields.app-optional-link-group')}
        items={applicationOptionalLinksFormItems(translate, application)}
    />,
];

export default function VitalityApplicationCreateEditView({ mode }) {
    const { translate } = useTranslation();
    const resourceOptions = {
        meta: { gqlQuery: CreateOrEditApplication },
    };

    if (mode === 'edit') {
        return (
            <RefineEditWrapper
                title={
                    <Typography.Title level={2}>
                        {translate('v6y-applications.titles.edit')}
                    </Typography.Title>
                }
                resourceOptions={resourceOptions}
                formItems={VitalityApplicationCreateEditItems(translate)}
            />
        );
    }

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-applications.titles.create')}
                </Typography.Title>
            }
            resourceOptions={resourceOptions}
            formItems={VitalityApplicationCreateEditItems(translate)}
        />
    );
}
