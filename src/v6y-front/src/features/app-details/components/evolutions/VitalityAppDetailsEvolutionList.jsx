import React from 'react';

import VitalityCollapse from '../../../../commons/components/VitalityCollapse.jsx';
import VitalityAppDetailsEvolutionListItem from './VitalityAppDetailsEvolutionListItem.jsx';

const VitalityAppDetailsEvolutionList = ({ evolutions }) => {
    const groupedEvolutions = evolutions?.reduce(
        (acc, next) => ({
            ...acc,
            [next.title]: {
                title: next.title,
                description: next.description,
                status: next.status,
                links: [...(acc[next.title]?.links || []), ...(next.links || [])],
                modules: [...(acc[next.title]?.modules || []), ...(next.modules || [])],
            },
        }),
        {},
    );

    const dataSource = Object.keys(groupedEvolutions || {})?.map((group, index) => ({
        key: `${group}-${index}`,
        label: group,
        children: <VitalityAppDetailsEvolutionListItem evolution={groupedEvolutions[group]} />,
    }));

    return <VitalityCollapse accordion bordered dataSource={dataSource} />;
};

export default VitalityAppDetailsEvolutionList;
