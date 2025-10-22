import React from 'react';

let currentSearch = new URLSearchParams('');
let currentPath = '/';
const subscribers = new Set<() => void>();

function notify() {
	subscribers.forEach((cb) => cb());
}

function setSearchFromUrl(url: string) {
	try {
		const qIndex = url.indexOf('?');
		const query = qIndex >= 0 ? url.substring(qIndex + 1) : '';
		currentSearch = new URLSearchParams(query);
	} catch (e) {
		currentSearch = new URLSearchParams('');
	}
	notify();
}

export function setMockSearch(url: string) {
	setSearchFromUrl(url);
}

export function setMockPath(path: string) {
	currentPath = path;
	notify();
}

export const usePathname = () => currentPath;

export const useRouter = () => ({
	push: (url: string) => setSearchFromUrl(url),
	replace: (url: string) => setSearchFromUrl(url),
});

export const useSearchParams = () => {
	const [, setTick] = React.useState(0);
	React.useEffect(() => {
		const cb = () => setTick((t) => t + 1);
		subscribers.add(cb);
		return () => {
			subscribers.delete(cb);
		};
	}, []);

	return {
		get: (k: string) => currentSearch.get(k),
		toString: () => currentSearch.toString(),
	};
};

export const redirect = () => {};
export const useServerInsertedHTML = () => '';
