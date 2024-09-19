import { Collapse } from 'antd';

import VitalityEmptyView from './VitalityEmptyView.jsx';


const VitalityCollapse = ({ bordered, accordion, dataSource }) => {
    return (
        <>
            {dataSource?.length > 0 ? (
                <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
            ) : (
                <VitalityEmptyView />
            )}
        </>
    );
};

export default VitalityCollapse;
