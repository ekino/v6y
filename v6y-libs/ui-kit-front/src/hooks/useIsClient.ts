'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns true only once the component has hydrated on the client.
 * Useful to defer client-only data (e.g. browser-detected locale) until after
 * hydration, avoiding server/client markup mismatches, without resorting to a
 * `useState` + `useEffect` "mounted" flag (which itself trips
 * react-hooks/set-state-in-effect).
 */
export const useIsClient = () =>
    useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
