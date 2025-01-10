import { Empty, Typography } from 'antd';

import VitalityTerms from '../config/VitalityTerms';

const VitalityEmptyView = ({ message }: { message?: string }) => (
    <Empty
        description={
            <Typography.Text>
                {message || VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE}
            </Typography.Text>
        }
    />
);

export default VitalityEmptyView;
