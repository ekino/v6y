import { Result, SmileOutlined, useTranslationProvider } from '@v6y/shared-ui';
import { AdminMessageType } from '@v6y/shared-ui/src';

const VitalityMessageView = ({ type }: AdminMessageType) => {
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
