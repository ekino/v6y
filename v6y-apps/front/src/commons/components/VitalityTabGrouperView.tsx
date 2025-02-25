import { Col, Row, Tabs, VitalityEmptyView } from '@v6y/shared-ui';
import * as React from 'react';

import useDataGrouper from '../hooks/useDataGrouper';
import { VitalityDataGrouperProps } from '../types/VitalityDataGrouperProps';

const VitalityTabGrouperView = ({
    name,
    hasAllGroup,
    dataSource,
    criteria,
    align,
    ariaLabelledby,
    onRenderChildren,
    onGroupChanged,
}: VitalityDataGrouperProps) => {
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
            ? groupedDataSource?.[selectedCriteria?.key || '']
            : dataSource) || [];

    return (
        <Row wrap gutter={[16, 16]} justify={align || 'end'} align="middle">
            <Col span={24}>
                <form name={name}>
                    {criteriaGroups?.length > 0 && (
                        <Tabs
                            centered
                            aria-labelledby={ariaLabelledby}
                            items={criteriaGroups}
                            onChange={(activeTabKey) => {
                                setSelectedCriteria({
                                    label: undefined,
                                    value: '',
                                    key: activeTabKey,
                                });
                                onGroupChanged?.(activeTabKey);
                            }}
                        />
                    )}
                </form>
            </Col>
            <Col span={23}>
                {valuesByGroup?.length ? (
                    <>{onRenderChildren?.(selectedCriteria?.key || '', valuesByGroup)}</>
                ) : (
                    <VitalityEmptyView />
                )}
            </Col>
        </Row>
    );
};

export default VitalityTabGrouperView;
