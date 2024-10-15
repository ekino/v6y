import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// Générer un token JWT
const generateToken = (accountId: number) => {
    if (!SECRET_KEY) {
        throw new Error('JWT secret key is not defined');
    }
    return jwt.sign({ _id: accountId }, SECRET_KEY);
};

// Vérifier un token JWT
const verifyToken = (token: string) => {
    try {
        if (!SECRET_KEY) {
            throw new Error('JWT secret key is not defined');
        }
        return jwt.verify(token, SECRET_KEY);
    } catch {
        throw new Error('Invalid or expired token');
    }
};

const JwtUtils = {
    generateToken,
    verifyToken,
};

export default JwtUtils;
