import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';

import { useTranslation } from '../../infrastructure/adapters/translation/TranslationAdapter.js';


const VitalityMessageView = ({ type }) => {
    const { translate } = useTranslation();
    return (
        <>
            {type === 'error' && <Result status="error" title={translate('pages.error.general')} />}
            {type === 'coming-soon' && (
                <Result icon={<SmileOutlined />} title={translate('pages.error.coming-soon')} />
            )}
        </>
    );
};

export default VitalityMessageView;
