const STACK_MIN_VALID_VERSIONS = {
  react: '17.0.2',
  'react-dom': '17.0.2',
  'react-hot-loader': '4.13.0',
  'react-router-dom': '5.3.0',
};

const STACK_MIN_VALID_DEV_VERSIONS = {
  'ts-jest': '28.0.2',
  typescript: '4.5.5',
  '@babel/preset-typescript': '7.16.7',
  '@types/chai': '4.3.1',
  '@types/enzyme': '3.10.12',
  '@types/jest': '27.5.1',
  '@typescript-eslint/eslint-plugin': '5.12.1',
  '@typescript-eslint/parser': '5.12.1',
  webpack: '5.69.0',
  'webpack-bundle-analyzer': '4.5.0',
  'webpack-dev-server': '4.7.4',
  'css-loader': '6.6.0',
  'sass-loader': '12.6.0',
  '@babel/eslint-parser': '7.17.0',
  '@babel/eslint-plugin': '7.16.5',
  eslint: '8.9.0',
  'eslint-config-airbnb': '19.0.4',
  'eslint-plugin-import': '2.25.4',
  'eslint-plugin-jsx-a11y': '6.5.1',
  'eslint-plugin-react': '7.29.2',
  'eslint-plugin-react-hooks': '4.3.0',
  'eslint-config-airbnb-typescript': '16.1.0',
  'eslint-import-resolver-typescript': '2.5.0',
  'babel-jest': '28.1.0',
  chai: '4.3.6',
  enzyme: '3.11.0',
  'enzyme-adapter-react-16': '1.15.6',
  'enzyme-to-json': '3.6.2',
  jest: '28.1.0',
  'jest-sonar-reporter': '2.0.0',
  'jest-stare': '2.3.0',
  'jest-environment-jsdom': '28.1.0',
  husky: '8.0.1',
};

const FRONTEND_MIN_VALID_VERSIONS = {
  ...STACK_MIN_VALID_VERSIONS,
  ...STACK_MIN_VALID_DEV_VERSIONS,
};

const FRONTEND_DEPRECATED_DEPENDENCIES = [
  '@babel/polyfill/noConflict',
  '@babel/polyfill',
  '@babel/compat-data',
  '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-modules-commonjs',
  '@babel/polyfill',
  'babel-plugin-dynamic-import-node',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-syntax-class-properties',
  '@babel/plugin-transform-react-jsx',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  'node-sass',
  'lodash',
  'moment',
  '@types/lodash',
  'babel-plugin-lodash',
  'smoothscroll-polyfill',
  'whatwg-fetch',
  'libphonenumber-js',
  'es6-promise-promise',
  'url-search-params-polyfill',
];

const DepsConfig = {
  FRONTEND_DEPRECATED_DEPENDENCIES,
  FRONTEND_MIN_VALID_VERSIONS,
};

export default DepsConfig;
