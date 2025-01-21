import { SyncOutlined } from '@ant-design/icons';
import { VitalityTerms } from '@v6y/core-logic';
import { Button, Flex, List } from 'antd';

import { VitalityListProps } from '../types/VitalityListProps';

const VitalityLoadMoreList = ({
    isDataSourceLoading,
    bordered = true,
    dataSource,
    renderItem,
    onLoadMore,
}: VitalityListProps) => (
    <List
        bordered={bordered}
        style={{ marginBottom: '1rem' }}
        loading={isDataSourceLoading}
        itemLayout="horizontal"
        loadMore={
            !isDataSourceLoading && dataSource?.length && onLoadMore ? (
                <Flex justify="center" align="center" style={{ margin: '2rem' }}>
                    <Button
                        size="middle"
                        type="default"
                        icon={<SyncOutlined />}
                        iconPosition="end"
                        onClick={onLoadMore}
                    >
                        {VitalityTerms.VITALITY_APP_LIST_LOAD_MORE_LABEL}
                    </Button>
                </Flex>
            ) : null
        }
        dataSource={dataSource}
        renderItem={renderItem}
    />
);

export default VitalityLoadMoreList;
