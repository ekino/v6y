// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookie from 'js-cookie';

interface Auth {
    token?: string;
}

/**
 * Read user token
 */
const useToken = (): string | undefined => {
    const auth = Cookie.get('auth');
    const parsedAuth: Auth = JSON.parse(auth || '{}');

    return parsedAuth.token;
};

export default useToken;
