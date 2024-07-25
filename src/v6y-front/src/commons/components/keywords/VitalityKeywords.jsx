import { useState } from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import VitalityConfig from '../../config/VitalityConfig.js';
import VitalityKeywordItem from './VitalityKeywordItem.jsx';

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
        <div
            style={{
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <AutoSizer disableHeight>
                {({ width }) => (
                    <VariableSizeList
                        direction="horizontal"
                        itemCount={keywords?.length || 0}
                        itemSize={(index) => {
                            const currentText = keywords?.[index]?.label;
                            return getTextWidth(currentText);
                        }}
                        height={50}
                        width={width}
                    >
                        {({ index, style }) => {
                            const keyword = keywords?.[index];
                            return (
                                <div key={keyword.label} style={style}>
                                    <VitalityKeywordItem
                                        keyword={keyword}
                                        type={
                                            selectedKeywords?.includes(keyword.label)
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onSelectedKeyword={handleSelectedKeyword}
                                    />
                                </div>
                            );
                        }}
                    </VariableSizeList>
                )}
            </AutoSizer>
        </div>
    );
};

export default VitalityKeywords;
