import { FaqConfig } from '@v6y/commons';

const getFaqList = () => {
  return FaqConfig.buildData();
};

const FaqQueries = {
  getFaqList,
};

export default FaqQueries;
