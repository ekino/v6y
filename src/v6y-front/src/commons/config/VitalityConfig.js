import VitalityGraphqlConfig from './VitalityGraphqlConfig';

const { VITALITY_BFF_URL } = VitalityGraphqlConfig;

const VITALITY_BFF_PAGE_SIZE = 10;

const VITALITY_DASHBOARD_DATASOURCE = [
    {
        autoFocus: true,
        defaultChecked: false,
        title: 'React',
        description: 'Choose this option to view React applications.',
        url: 'app-list?keywords=react',
        imageUrl: 'react_logo.svg',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular',
        description: 'Choose this option to view Angular applications.',
        url: 'app-list?keywords=angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'React Legacy',
        description: 'Choose this option to view React Legacy applications.',
        url: 'app-list?keywords=legacy-react',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular Legacy',
        description: 'Choose this option to view Angular Legacy applications.',
        url: 'app-list?keywords=legacy-angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Stack usage stats',
        description: 'Choose this option to view Stack usage stats.',
        url: 'stack-stats',
        imageUrl: '',
    },
];

const getTextWidth = (text) => {
    const padding = 16;
    const margin = 5;
    const defaultWidth = 100;

    if (!text?.length) {
        return defaultWidth + 2 * padding + 2 * margin;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'normal normal 600 16px sourcesanspro';

    return context.measureText(text).width + 2 * padding + 2 * margin;
};

const VitalityConfig = {
    VITALITY_BFF_URL,
    VITALITY_BFF_PAGE_SIZE,
    VITALITY_DASHBOARD_DATASOURCE,
    getTextWidth,
};

export default VitalityConfig;
