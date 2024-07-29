const buildData = () => [
  {
    title: 'Vitality Update Available!',
    color: '14',
    description:
      'Vitality v2.5 is now ready for download.  New features include enhanced performance monitoring and improved code analysis.',
    links: [
      {
        type: 'download',
        label: 'Update Now',
        value: 'https://downloads.vitality.app/v2.5',
      },
      {
        type: 'release-notes',
        label: 'Release Notes',
        value: 'https://docs.vitality.app/release-notes/v2.5',
      },
    ],
  },
  {
    title: 'Potential Performance Issue Detected',
    color: '14',
    description:
      'Vitality has identified a potential performance issue in your XYZ service. Please review the detailed report for recommendations.',
    links: [
      {
        type: 'report',
        label: 'View Report',
        value: 'https://app.vitality.app/reports/xyz-service-performance-issue',
      },
    ],
  },
  {
    title: 'Security Vulnerability Patched',
    color: '14',
    description:
      'A critical security vulnerability in Vitality\'s dependency library has been addressed. Please update to the latest version.',
    links: [
      {
        type: 'update',
        label: 'Update Instructions',
        value: 'https://docs.vitality.app/update-instructions',
      },
    ],
  },
  {
    title: 'New Tutorial: Optimizing Frontend Code',
    color: '14',
    description:
      'Our latest tutorial shows you how to leverage Vitality\'s insights to improve your frontend code\'s performance and maintainability.',
    links: [
      {
        type: 'tutorial',
        label: 'Read the Tutorial',
        value: 'https://docs.vitality.app/tutorials/frontend-optimization',
      },
    ],
  },
];

const NotificationsConfig = {
  buildData,
};

export default NotificationsConfig;
