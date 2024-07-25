import {FaqConfig,} from '@v6y/commons';

const getFaqListByPageAndParams = () => {
  return FaqConfig.buildData();
};


const FaqQueries = {
  getFaqListByPageAndParams,
};

export default FaqQueries;
