import React from 'react';

import VitalityLinks from './VitalityLinks.jsx';

const VitalityLegend = ({ legend }) => (
    <>
        <p>{legend.description}</p>
        <VitalityLinks links={legend.links || legend.docLinks || []} />
    </>
);

export default VitalityLegend;
