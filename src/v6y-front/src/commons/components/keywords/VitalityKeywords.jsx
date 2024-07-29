import { useState } from 'react';
import VitalityConfig from '../../config/VitalityConfig.js';
import VitalityKeywordItem from './VitalityKeywordItem.jsx';
import VitalityInfiniteList from '../VitalityInfiniteList.jsx';

const { getTextWidth } = VitalityConfig;

const VitalityKeywords = ({ keywords, onSelectedKeyword }) => {
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const handleSelectedKeyword = (keyword) => {
        if (selectedKeywords?.includes(keyword.label)) {
            setSelectedKeywords(selectedKeywords?.filter((label) => keyword.label !== label));
            return;
        }

        setSelectedKeywords([...selectedKeywords, keyword.label]);
    };

    return (
        <VitalityInfiniteList
            dataSource={keywords}
            itemHeight={60}
            itemSize={(index) => {
                const currentText = keywords?.[index]?.label;
                return getTextWidth(currentText);
            }}
            renderItem={({ index, style }) => {
                const keyword = keywords?.[index];
                return (
                    <div
                        key={keyword.label}
                        style={{
                            ...style,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <VitalityKeywordItem
                            keyword={keyword}
                            type={selectedKeywords?.includes(keyword.label) ? 'primary' : 'default'}
                            onSelectedKeyword={handleSelectedKeyword}
                        />
                    </div>
                );
            }}
        />
    );
};

export default VitalityKeywords;
