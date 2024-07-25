import { Button, Flex, List } from 'antd';
import CommonsDico from '../dico/CommonsDico.js';

const VitalityInfiniteList = ({ isDataSourceLoading, dataSource, renderItem, onLoadMore }) => (
    <Flex
        justify="center"
        align="center"
        style={{ width: '100%', marginTop: '2rem', marginBottom: '2rem' }}
    >
        <List
            style={{ width: '70%' }}
            bordered
            loading={isDataSourceLoading}
            itemLayout="horizontal"
            loadMore={
                !isDataSourceLoading && dataSource?.length ? (
                    <Flex justify="center" align="center" style={{ margin: '2rem' }}>
                        <Button type="primary" onClick={onLoadMore}>
                            {CommonsDico.VITALITY_APP_LIST_LOAD_MORE_LABEL}
                        </Button>
                    </Flex>
                ) : null
            }
            dataSource={dataSource}
            renderItem={renderItem}
        />
    </Flex>
);

export default VitalityInfiniteList;
