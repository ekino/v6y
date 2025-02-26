import { Button, Flex, List, SyncOutlined } from '../../atoms';
import { PaginatedListType } from '../../types';

const VitalityLoadMoreList = ({
    isDataSourceLoading,
    loadMoreLabel,
    bordered = true,
    dataSource,
    renderItem,
    onLoadMore,
}: PaginatedListType) => (
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
                        {loadMoreLabel}
                    </Button>
                </Flex>
            ) : null
        }
        dataSource={dataSource}
        renderItem={renderItem}
    />
);

export default VitalityLoadMoreList;
