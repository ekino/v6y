import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const validatePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

const PasswordUtils = {
    hashPassword,
    validatePassword,
};

export default PasswordUtils;
