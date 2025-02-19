import { SmileOutlined } from '@ant-design/icons';
import { useTranslationProvider } from '@v6y/shared-ui';
import { Result } from 'antd';

import { VitalityMessageType } from '../types/VitalityMessageType';

const VitalityMessageView = ({ type }: VitalityMessageType) => {
    const { translate } = useTranslationProvider();
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
