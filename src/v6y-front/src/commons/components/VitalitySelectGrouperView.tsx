import { Col, Form, Row, Select, Typography } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';

import useDataGrouper from '../hooks/useDataGrouper';
import { VitalityDataGrouperProps } from '../types/VitalityDataGrouperProps';
import VitalityEmptyView from './VitalityEmptyView';

const VitalitySelectGrouperView = ({
    dataSource,
    criteria,
    placeholder,
    label,
    helper,
    name = 'criteria_grouper_select',
    disabled,
    hasAllGroup,
    onRenderChildren,
}: VitalityDataGrouperProps) => {
    const [selectGroupForm] = Form.useForm();
    const { groupedDataSource, selectedCriteria, criteriaGroups, setSelectedCriteria } =
        useDataGrouper({
            dataSource,
            criteria,
            hasAllGroup,
        });

    useEffect(() => {
        selectGroupForm?.setFieldsValue({
            [name]: hasAllGroup ? 'All' : null,
        });
    }, [groupedDataSource]);

    if (!dataSource?.length || !criteria?.length) {
        return <VitalityEmptyView />;
    }

    if (!Object.keys(groupedDataSource || {})?.length) {
        return <VitalityEmptyView />;
    }

    const valuesByGroup =
        (selectedCriteria?.value !== 'All'
            ? groupedDataSource?.[selectedCriteria?.value || '']
            : dataSource) || [];

    return (
        <Row wrap gutter={[16, 24]} justify="center" align="middle">
            <Col span={24}>
                <Form
                    layout="vertical"
                    form={selectGroupForm}
                    disabled={disabled}
                    onValuesChange={(values) =>
                        setSelectedCriteria({
                            key: '',
                            label: undefined,
                            value: values?.[name],
                        })
                    }
                >
                    <Form.Item
                        name={name}
                        label={<Typography.Text>{label}</Typography.Text>}
                        help={<Typography.Text>{helper}</Typography.Text>}
                    >
                        <Select
                            placeholder={placeholder}
                            options={criteriaGroups}
                            style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={23}>
                {valuesByGroup?.length ? (
                    <>{onRenderChildren?.(selectedCriteria?.value || '', valuesByGroup)}</>
                ) : (
                    <VitalityEmptyView />
                )}
            </Col>
        </Row>
    );
};

export default VitalitySelectGrouperView;
