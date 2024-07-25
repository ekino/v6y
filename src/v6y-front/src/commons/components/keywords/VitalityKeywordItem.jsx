import { Button } from 'antd';

const VitalityKeywordItem = ({ keyword, type, onSelectedKeyword }) => (
    <Button
        key={`${keyword._id}-${keyword.label}`}
        type={type}
        onClick={() => onSelectedKeyword(keyword)}
    >
        {keyword.label}
    </Button>
);

export default VitalityKeywordItem;
