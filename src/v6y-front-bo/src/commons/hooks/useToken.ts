import Cookies from 'js-cookie';

interface Auth {
    token?: string;
}

const useToken = (): string | undefined => {
    const auth = Cookies.get('auth');
    const parsedAuth: Auth = JSON.parse(auth || '{}');

    return parsedAuth.token;
};

export default useToken;
