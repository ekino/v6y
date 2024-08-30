import { Col, Row, Tabs } from 'antd';
import React from 'react';

import useDataGrouper from '../hooks/useDataGrouper.jsx';
import VitalityEmptyView from './VitalityEmptyView.jsx';


const VitalityTabGrouperView = ({
    name,
    hasAllGroup,
    dataSource,
    criteria,
    align,
    ariaLabelledby,
    onRenderChildren,
    onGroupChanged,
}) => {
    const { groupedDataSource, selectedCriteria, criteriaGroups, setSelectedCriteria } =
        useDataGrouper({
            dataSource,
            criteria,
            hasAllGroup,
        });

    if (!dataSource?.length || !criteria?.length) {
        return <VitalityEmptyView />;
    }

    if (!Object.keys(groupedDataSource || {})?.length) {
        return <VitalityEmptyView />;
    }

    const valuesByGroup =
        (selectedCriteria?.key !== 'All'
            ? groupedDataSource?.[selectedCriteria?.key]
            : dataSource) || [];

    return (
        <Row wrap gutter={[16, 16]} justify={align || 'end'} align="middle">
            <Col span={24}>
                <Tabs
                    centered
                    name={name}
                    aria-labelledby={ariaLabelledby}
                    items={criteriaGroups}
                    onChange={(activeTabKey) => {
                        setSelectedCriteria({
                            key: activeTabKey,
                        });
                        onGroupChanged?.(activeTabKey);
                    }}
                />
            </Col>
            <Col span={23}>
                {valuesByGroup?.length ? (
                    <>{onRenderChildren?.(selectedCriteria?.key, valuesByGroup)}</>
                ) : (
                    <VitalityEmptyView />
                )}
            </Col>
        </Row>
    );
};

export default VitalityTabGrouperView;
