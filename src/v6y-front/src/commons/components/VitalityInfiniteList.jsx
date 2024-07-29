import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';

const VitalityInfiniteList = ({ dataSource, itemHeight, itemSize, renderItem }) => (
    <AutoSizer disableHeight>
        {({ width }) => (
            <VariableSizeList
                direction="horizontal"
                itemCount={dataSource?.length || 0}
                itemSize={itemSize}
                height={itemHeight}
                width={width}
            >
                {renderItem}
            </VariableSizeList>
        )}
    </AutoSizer>
);

export default VitalityInfiniteList;
