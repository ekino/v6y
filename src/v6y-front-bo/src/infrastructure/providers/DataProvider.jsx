'use client';

import dataProviderSimpleRest from '@refinedev/simple-rest';

export const DataProvider = (apiBaseUrl) => dataProviderSimpleRest(apiBaseUrl);
