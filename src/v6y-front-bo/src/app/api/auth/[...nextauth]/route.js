import NextAuth from 'next-auth/next';

import { VitalityAuthConfig } from '../../../../commons/auth/VitalityAuthHelper.js';

const auth = NextAuth.default(VitalityAuthConfig);

export { auth as GET, auth as POST };
