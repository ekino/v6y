import * as React from 'react';
import { useEffect } from 'react';

import Form from '@v6y/ui-kit/components/atoms/app/Form.tsx';
import { Col, Row } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import Select from '@v6y/ui-kit/components/atoms/app/Select.tsx';
import EmptyView from '@v6y/ui-kit/components/organisms/app/EmptyView.tsx';
import TextView from '@v6y/ui-kit/components/organisms/app/TextView.tsx';

import useDataGrouper from '../hooks/useDataGrouper';
import { VitalityDataGrouperProps } from '../types/VitalityDataGrouperProps';

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
    }, [groupedDataSource, hasAllGroup, name, selectGroupForm]);

    if (!dataSource?.length || !criteria?.length) {
        return <EmptyView />;
    }

    if (!Object.keys(groupedDataSource || {})?.length) {
        return <EmptyView />;
    }

    const valuesByGroup =
        (selectedCriteria?.value !== 'All'
            ? groupedDataSource?.[selectedCriteria?.value || '']
            : dataSource) || [];

    return (
        <Row wrap gutter={[16, 24]} justify="center" align="middle">
            <Col span={24}>
                <Form
                    role="form"
                    data-testid={name}
                    layout="vertical"
                    form={selectGroupForm}
                    disabled={disabled}
                    onValuesChange={(values) => {
                        setSelectedCriteria({
                            key: '',
                            label: undefined,
                            value: values?.[name],
                        });
                    }}
                >
                    <Form.Item
                        name={name}
                        label={<TextView content={label} />}
                        help={<TextView content={helper} />}
                    >
                        <Select placeholder={placeholder} options={criteriaGroups} />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={23}>
                {valuesByGroup?.length ? (
                    <>{onRenderChildren?.(selectedCriteria?.value || '', valuesByGroup)}</>
                ) : (
                    <EmptyView />
                )}
            </Col>
        </Row>
    );
};

export default VitalitySelectGrouperView;
