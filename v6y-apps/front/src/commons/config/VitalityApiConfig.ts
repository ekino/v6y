const VITALITY_BFF_URL = '/v6y/graphql';
// Points at the back-office admin app (v6y-apps/back-office), still named
// FRONT_BO for backwards-compat with existing deployment env vars.
const VITALITY_FRONT_BO_URL = process.env.NEXT_PUBLIC_V6Y_FRONT_BO_PATH || 'http://localhost:3001';
const VITALITY_BFF_PAGE_SIZE = 10;

const VitalityApiConfig = {
    VITALITY_BFF_URL,
    VITALITY_FRONT_BO_URL,
    VITALITY_BFF_PAGE_SIZE,
};

export default VitalityApiConfig;
