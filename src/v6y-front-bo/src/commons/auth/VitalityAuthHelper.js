import CredentialsProvider from 'next-auth/providers/credentials';

const CredentialsProviderApi = CredentialsProvider.default;

export const VitalityAuthOptions = {
    login: {
        type: 'login',
        registerLink: false,
        forgotPasswordLink: false,
        rememberMe: false,
    },
};

const user = {
    id: '1',
    name: 'John Doe',
    email: 'demo@refine.dev',
    image: 'https://i.pravatar.cc/300',
};

export const VitalityAuthConfig = {
    providers: [
        CredentialsProviderApi({
            id: 'CredentialsSignIn',
            credentials: {},
            async authorize(credentials) {
                // TODO: Request your API to check credentials
                console.log('CredentialsSignIn', JSON.stringify(credentials, null, 2));

                // check credentials
                // if not valid return null
                if (credentials?.['email'] !== 'demo@refine.dev') {
                    return null;
                }

                // return logged user
                return user;
            },
        }),
        CredentialsProviderApi({
            id: 'CredentialsSignUp',
            credentials: {},
            async authorize(credentials) {
                // TODO: Request your API to create new user
                console.log('CredentialsSignUp', JSON.stringify(credentials, null, 2));

                // return logged user
                return user;
            },
        }),
    ],
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};
