const VITALITY_BFF_URL = process.env.NEXT_PUBLIC_V6Y_BFF_PATH;
const VITALITY_FRONT_BO_URL = process.env.NEXT_PUBLIC_V6Y_FRONT_BO_PATH || 'http://localhost:3001';
const VITALITY_BFF_PAGE_SIZE = 10;

const VitalityApiConfig = {
    VITALITY_BFF_URL,
    VITALITY_FRONT_BO_URL,
    VITALITY_BFF_PAGE_SIZE,
};

export default VitalityApiConfig;
