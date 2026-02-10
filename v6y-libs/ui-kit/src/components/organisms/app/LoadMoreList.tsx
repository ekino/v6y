import { SyncOutlined } from '../../atoms/Icons';
import Button from '../../atoms/app/Button';
import Flex from '../../atoms/app/Flex';
import { List } from '../../atoms/app/List';
import { PaginatedListType } from '../../types/PaginatedListType';

const LoadMoreList = ({
    isDataSourceLoading,
    loadMoreLabel,
    bordered = true,
    dataSource,
    renderItem,
    onLoadMore,
}: PaginatedListType) => (
    <List
        bordered={bordered}
        loading={isDataSourceLoading}
        itemLayout="horizontal"
        loadMore={
            !isDataSourceLoading && dataSource?.length && onLoadMore ? (
                <Flex justify="center" align="center">
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

export default LoadMoreList;
