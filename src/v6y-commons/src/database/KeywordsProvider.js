import AppLogger from '../core/AppLogger.js';

const insertKeyword = async (keyword) => {
  try {
    AppLogger.info(`[insertKeyword] keyword label:  ${keyword?.label}`);
    if (!keyword?.label?.length) {
      return {};
    }

    return null;
  } catch (error) {
    AppLogger.info(`[insertKeyword] error:  ${error.message}`);
    return {};
  }
};

const insertKeywordList = async (keywordList) => {
  try {
    if (!keywordList?.length) {
      return;
    }

    for (const keyword of keywordList) {
      await insertKeyword(keyword);
    }
  } catch (error) {
    AppLogger.info(`[insertKeywordList] error:  ${error.message}`);
  }
};

const deleteKeywordsList = async () => {
  try {
  } catch (error) {
    AppLogger.info(`[deleteKeywordsList] error:  ${error.message}`);
  }
};

const getKeywordsByParams = async () => {
  try {
    return (
      [
        {
          _id: '9a9a9a9a9a9a9a9a9a9a9a9a',
          branch: 'main',
          color: 'warning',
          helpMessage: 'This project uses React (16.8.0)',
          label: 'React (16.8.0)',
          type: 'frontend',
        },
      ],
      [
        {
          _id: '9b9b9b9b9b9b9b9b9b9b9b9b',
          branch: 'develop',
          color: 'success',
          helpMessage: 'This project uses Vue.js (4.0.0).',
          label: 'Vue.js (4.0.0)',
          type: 'frontend',
        },
        {
          _id: '8b8b8b8b8b8b8b8b8b8b8b8b',
          branch: 'main',
          color: 'success',
          helpMessage: 'Codebase written in TypeScript.',
          label: 'TypeScript',
          type: 'frontend',
        },
      ],
      [
        {
          _id: '9c9c9c9c9c9c9c9c9c9c9c9c',
          branch: 'main',
          color: 'error',
          helpMessage: 'This project uses Angular (1.0.0).',
          label: 'Angular (1.0.0)',
          type: 'frontend',
        },
        {
          _id: '8c8c8c8c8c8c8c998c8c8c8c8c',
          branch: 'develop',
          color: 'success',
          helpMessage: 'Code linting with ESLint.',
          label: 'ESLint',
          type: 'frontend',
        },
      ]
    );
  } catch (error) {
    AppLogger.info(`[getKeywordsByParams] error:  ${error.message}`);
    return [];
  }
};

const KeywordsProvider = {
  insertKeywordList,
  getKeywordsByParams,
  deleteKeywordsList,
};

export default KeywordsProvider;
