import { SmileOutlined } from '@ant-design/icons';

import Result from '@v6y/ui-kit/components/atoms/app/Result';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

type VitalityMessageViewProps = {
    type: 'error' | 'coming-soon';
};

const VitalityMessageView = ({ type }: VitalityMessageViewProps) => {
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
