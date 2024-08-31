import React from 'react';

import VitalityCollapse from '../../../../commons/components/VitalityCollapse.jsx';
import VitalityAppDetailsEvolutionListItem from './VitalityAppDetailsEvolutionListItem.jsx';

const VitalityAppDetailsEvolutionList = ({ evolutions }) => {
    const groupedEvolutions = evolutions?.reduce(
        (acc, next) => ({
            ...acc,
            [next?.evolutionHelp?.title]: {
                title: next?.evolutionHelp?.title,
                description: next?.evolutionHelp?.description,
                status: next?.evolutionHelp?.status,
                links: [...(acc[next.title]?.links || []), ...(next?.evolutionHelp?.links || [])],
                modules: [...(acc[next.title]?.modules || []), next.module],
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
