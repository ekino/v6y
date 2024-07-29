import AppLogger from '../core/AppLogger.js';

const insertApp = async (app) => {
  try {
    return null;
  } catch (error) {
    AppLogger.info(`[insertApp] error: ${error.message}`);
    return null;
  }
};

const deleteAppList = async () => {
  try {
  } catch (error) {
    AppLogger.info(`[deleteAppList] error:  ${error.message}`);
  }
};

const getAppsByParams = async ({ keywords, searchText, offset, limit }) => {
  try {
    AppLogger.info(`[getAppsByParams] keywords: ${keywords?.join('\r\n')}`);
    AppLogger.info(`[getAppsByParams] searchText: ${searchText}`);
    AppLogger.info(`[getAppsByParams] offset: ${offset}`);
    AppLogger.info(`[getAppsByParams] limit: ${limit}`);

    return [
      {
        _id: '5a5a5a5a5a5a5a5a5a5a5a5a',
        name: 'Cloud Music Streaming',
        description:
          'A cutting-edge music streaming platform with a React-based frontend and Node.js backend, allowing users to discover, create playlists, and enjoy their favorite tunes on any device.',
        repo: {
          _id: '6a6a6a6a6a6a6a6a6a6a6a6a',
          name: 'sonorous',
          fullName: 'TuneTech/sonorous',
          owner: 'TuneTech',
          webUrl: 'https://github.com/TuneTech/sonorous',
          gitUrl: 'git@github.com:TuneTech/sonorous.git',
          allBranches: ['main', 'develop', 'feature/offline-mode'],
        },
        links: [
          {
            _id: '7a7a7a7a7a7a7a7a7a7a7a7a',
            type: 'help',
            label: 'Support Center',
            value: 'https://help.sonorous.app',
            description: 'Get help with your account and music.',
          },
        ],
        keywords: [
          {
            _id: '9a9a9a9a9a9a9a9a9a9a9a9a',
            type: 'frontend',
            branch: 'main',
            label: 'React (16.8.0)',
            color: 'warning',
            helpMessage: 'This project uses React (16.8.0)',
          },
        ],
      },
      {
        _id: '5b5b5b5b5b5b5b5b5b5b5b5b',
        name: 'Real-Time Collaboration Suite',
        description:
          'A comprehensive platform for teams to collaborate seamlessly, featuring real-time document editing, video conferencing, and project management tools. Built with Vue.js and TypeScript.',
        repo: {
          _id: '6b6b6b6b6b6b6b6b6b6b6b6b',
          name: 'synergy-workspace',
          fullName: 'CollabCo/synergy-workspace',
          owner: 'CollabCo',
          webUrl: 'https://github.com/CollabCo/synergy-workspace',
          gitUrl: 'git@github.com:CollabCo/synergy-workspace.git',
          allBranches: ['main', 'feature/video-chat'],
        },
        links: [
          {
            _id: '7b7b7b7b7b7b7b7b7b7b7b7b',
            type: 'doc',
            label: 'API Documentation',
            value: 'https://docs.synergy-workspace.com/api',
            description: 'Integrate with our powerful API.',
          },
        ],
        keywords: [
          {
            _id: '9b9b9b9b9b9b9b9b9b9b9b9b',
            type: 'frontend',
            branch: 'develop',
            label: 'Vue.js (4.0.0)',
            color: 'success',
            helpMessage: 'This project uses Vue.js (4.0.0).',
          },
          {
            _id: '8b8b8b8b8b8b8b8b8b8b8b8b',
            type: 'frontend',
            branch: 'main',
            label: 'TypeScript',
            color: 'success',
            helpMessage: 'Codebase written in TypeScript.',
          },
        ],
      },
      {
        _id: '5c5c5c5c5c5c5c5c5c5c5c5c',
        name: 'Personal Finance Tracker',
        description:
          'An intuitive personal finance application designed to help users track their income, expenses, and savings goals. Developed using Angular and ESLint for code quality.',
        repo: {
          _id: '6c6c6c6c6c6c6c6c6c6c6c6c',
          name: 'moneywise',
          fullName: 'FinTechGuru/moneywise',
          owner: 'FinTechGuru',
          webUrl: 'https://github.com/FinTechGuru/moneywise',
          gitUrl: 'git@github.com:FinTechGuru/moneywise.git',
          allBranches: ['main', 'hotfix/budgeting-bug'],
        },
        links: [
          {
            _id: '7c7c7c7c7c7c7c7c7c7c7c7c',
            type: 'others',
            label: 'Community Forum',
            value: 'https://forum.moneywise.app',
            description: 'Connect with other users and share tips.',
          },
        ],
        keywords: [
          {
            _id: '9c9c9c9c9c9c9c9c9c9c9c9c',
            type: 'frontend',
            branch: 'main',
            label: 'Angular (1.0.0)',
            color: 'error',
            helpMessage: 'This project uses Angular (1.0.0).',
          },
          {
            _id: '8c8c8c8c8c8c8c998c8c8c8c8c',
            type: 'frontend',
            branch: 'develop',
            label: 'ESLint',
            color: 'success',
            helpMessage: 'Code linting with ESLint.',
          },
        ],
      },
    ].slice(offset, offset + limit);
  } catch (error) {
    AppLogger.info(`[getAppsByParams] error: ${error.message}`);
    return [];
  }
};

const getAppsCountByParams = async ({ searchText, keywords }) => {
  try {
    AppLogger.info(`[getAppsCountByParams] searchText: ${searchText}`);

    return 0;
  } catch (error) {
    AppLogger.info(`[getAppsCountByParams] error: ${error.message}`);
    return 0;
  }
};

const AppProvider = {
  insertApp,
  getAppsByParams,
  getAppsCountByParams,
  deleteAppList,
};

export default AppProvider;
