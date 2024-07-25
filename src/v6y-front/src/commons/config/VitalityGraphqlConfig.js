const isPROD = false;
const VITALITY_BFF_PATH = '/v6y/graphql';
const VITALITY_PROD_BFF_URL = VITALITY_BFF_PATH;
const VITALITY_DEV_BFF_URL = `http://localhost:4001${VITALITY_BFF_PATH}`;

const VITALITY_BFF_URL = isPROD ? VITALITY_PROD_BFF_URL : VITALITY_DEV_BFF_URL;

const VitalityGraphqlConfig = {
    VITALITY_BFF_URL,
    VITALITY_DEV_BFF_URL,
};

export default VitalityGraphqlConfig;
