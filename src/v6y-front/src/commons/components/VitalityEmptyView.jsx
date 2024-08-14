import { Empty, Typography } from 'antd';

import VitalityTerms from '../config/VitalityTerms.js';

const VitalityEmptyView = ({ message }) => (
    <Empty
        description={
            <Typography.Text>
                {message || VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE}
            </Typography.Text>
        }
    />
);

export default VitalityEmptyView;
