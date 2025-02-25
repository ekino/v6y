import { Button, Flex, List, SyncOutlined } from '@v6y/shared-ui';

import VitalityTerms from '../config/VitalityTerms';
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
