import { AdminMessageType, Result, SmileOutlined, useTranslationProvider } from '@v6y/ui-kit';

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
