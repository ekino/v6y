import { Empty, Typography } from 'antd';

import { useTranslation } from '../../infrastructure/adapters/translation/TranslationAdapter';

const VitalityEmptyView = ({ message }: { message?: string }) => {
    const { translate } = useTranslation();
    return (
        <Empty
            description={
                <Typography.Text>{message || translate('pages.error.empty-data')}</Typography.Text>
            }
        />
    );
};

export default VitalityEmptyView;
