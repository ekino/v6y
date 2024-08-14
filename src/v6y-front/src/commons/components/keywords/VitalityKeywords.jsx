import { useState } from 'react';

import { getTextWidth } from '../../utils/VitalityCommonUtils.js';
import VitalityInfiniteList from '../VitalityInfiniteList.jsx';
import VitalityKeywordItem from './VitalityKeywordItem.jsx';

const VitalityKeywords = ({ keywords, onKeywordsChanged }) => {
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const handleSelectedKeyword = (keyword) => {
        if (selectedKeywords?.includes(keyword.label)) {
            setSelectedKeywords(selectedKeywords?.filter((label) => keyword.label !== label));
            return;
        }

        setSelectedKeywords([...selectedKeywords, keyword.label]);
        onKeywordsChanged?.([...selectedKeywords, keyword.label]);
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
