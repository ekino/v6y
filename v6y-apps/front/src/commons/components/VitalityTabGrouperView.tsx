import { Col, Row } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import Tabs from '@v6y/ui-kit/components/atoms/app/Tabs.tsx';
import EmptyView from '@v6y/ui-kit/components/organisms/app/EmptyView.tsx';

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
        return <EmptyView />;
    }

    if (!Object.keys(groupedDataSource || {})?.length) {
        return <EmptyView />;
    }

    const valuesByGroup =
        (selectedCriteria && selectedCriteria?.key !== 'All'
            ? groupedDataSource?.[selectedCriteria?.key || '']
            : dataSource) || [];

    return (
        <Row wrap gutter={[16, 16]} justify={align || 'end'} align="middle">
            <Col span={24}>
                <form name={name} data-testid={name}>
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
                    <EmptyView />
                )}
            </Col>
        </Row>
    );
};

export default VitalityTabGrouperView;
