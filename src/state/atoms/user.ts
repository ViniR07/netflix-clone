import { IProfile, ISession, IImageData } from '@types';
import { atom } from 'recoil';
import { imagesSelector, sessionSelector } from '../selectors';

const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

const localStorageEffect =
	key =>
	({ setSelf, onSet }) => {
		const savedValue = localStorage?.getItem(key);
		if (savedValue != null) {
			setSelf(JSON.parse(savedValue));
		}

		onSet((newValue, _, isReset) => {
			isReset
				? localStorage?.removeItem(key)
				: localStorage?.setItem(key, JSON.stringify(newValue));
		});
	};

export const profileAtom = atom<IProfile>({
	key: 'profileAtom',

	default: localStorage ? JSON.parse(localStorage.getItem('usuario')) : {},
	effects: [localStorageEffect('usuario')],
});

export const sessionAtom = atom({
	key: 'sessionAtom',
	default: {},
});

export const profileImagesAtom = atom<IImageData[]>({
	key: 'profileImagesAtom',
	default: imagesSelector,
});