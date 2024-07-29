import { Button, Flex, List } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import CommonsDico from '../dico/CommonsDico.js';

const VitalityLoadMoreList = ({ isDataSourceLoading, dataSource, renderItem, onLoadMore }) => (
    <List
        bordered
        style={{ marginBottom: '1rem' }}
        loading={isDataSourceLoading}
        itemLayout="horizontal"
        loadMore={
            !isDataSourceLoading && dataSource?.length && onLoadMore ? (
                <Flex justify="center" align="center" style={{ margin: '2rem' }}>
                    <Button
                        size="middle"
                        type="default"
                        icon={<SyncOutlined spin />}
                        iconPosition="end"
                        onClick={onLoadMore}
                    >
                        {CommonsDico.VITALITY_APP_LIST_LOAD_MORE_LABEL}
                    </Button>
                </Flex>
            ) : null
        }
        dataSource={dataSource}
        renderItem={renderItem}
    />
);

export default VitalityLoadMoreList;
