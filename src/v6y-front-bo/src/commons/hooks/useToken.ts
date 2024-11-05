
import Cookies from 'js-cookie';

const useToken = () => {
    const auth = Cookies.get('auth');
    const token = JSON.parse(auth || '{}')?.token;

    return token;
}

export default useToken;