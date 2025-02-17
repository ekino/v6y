import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Hashes a password using bcrypt
 * @param password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Validates a password against a hash
 * @param password
 * @param hash
 */
export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
