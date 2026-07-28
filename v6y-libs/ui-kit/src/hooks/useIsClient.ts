'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns true only once the component has hydrated on the client.
 * Prefer this over a `useState` + `useEffect` "mounted" flag: relying on
 * `useSyncExternalStore`'s server/client snapshots avoids triggering a
 * synchronous `setState` call inside an effect (react-hooks/set-state-in-effect).
 */
export const useIsClient = () =>
    useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
