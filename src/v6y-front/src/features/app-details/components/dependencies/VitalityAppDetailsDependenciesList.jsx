import VitalityPaginatedList from '../../../../commons/components/VitalityPaginatedList.jsx';
import VitalityAppDetailsDependenciesListItem from './VitalityAppDetailsDependenciesListItem.jsx';

const VitalityAppDetailsDependenciesList = ({ dependencies }) => {
    return (
        <VitalityPaginatedList
            dataSource={dependencies}
            renderItem={(dependency) => (
                <VitalityAppDetailsDependenciesListItem dependency={dependency} />
            )}
        />
    );
};

export default VitalityAppDetailsDependenciesList;
