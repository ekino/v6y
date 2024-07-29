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

const VitalityCommonConfig = {
    VITALITY_DASHBOARD_DATASOURCE,
};

export default VitalityCommonConfig;
