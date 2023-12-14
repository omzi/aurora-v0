/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
import { toast } from 'react-toastify';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ErrorResponse, SuccessResponse } from '#/common.types';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const isBase64Image = (imageData: string) => {
	return /^data:image\/(png|jpe?g|gif|webp);base64,/.test(imageData);
};

export const request = async <T>(
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	body?: any,
	headers?: Record<string, string>
): Promise<SuccessResponse<T> | ErrorResponse> => {
	const defaultHeaders = {
		'Content-Type': 'application/json',
		...headers
	};

	try {
		const response = await fetch(endpoint, {
			method,
			headers: defaultHeaders,
			body: body ? JSON.stringify(body) : null
		});

		if (!response.ok) {
			const errorData: ErrorResponse = await response.json();
			throw new Error(errorData.message);
		}

		const data: SuccessResponse<T> = await response.json();
		return data;
	} catch (error: any) {
		return {
			message:
				error.message ?? 'An error occurred while performing an action ;('
		};
	}
};

export const generateDefaultAvatar = (seed: string) => {
	return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
};

export const generateRandomChars = (() => {
	const generateChars = (min: number, max: number): string[] => Array.from({ length: max - min + 1 }, (_, i) => String.fromCharCode(min + i)
	);

	const sets = {
		numeric: generateChars(48, 57),
		lowerCase: generateChars(97, 122),
		upperCase: generateChars(65, 90),
		special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
		alphanumeric: [
			...generateChars(48, 57),
			...generateChars(65, 90),
			...generateChars(97, 122)
		]
	};

	const iter = function* (
		len: number,
		set: string[] | undefined
	): Generator<string, void, unknown> {
		if (set && set.length < 1) set = Object.values(sets).flat();
		for (let i = 0; i < len; i++) yield set![(Math.random() * set!.length) | 0];
	};

	return Object.assign(
		(len: number, ...set: string[]) => [...iter(len, set.flat())].join(''),
		sets
	);
})();

export const getInitials = (name: string): string => {
	const [first, second = ''] = name.split(' ');

	return (first + second).toUpperCase();
};

export const formatNumberWithCommas = (number: number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const copyToClipboard = async (text: string, successMessage: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(successMessage, { icon: '🌟' });
		return true;
	} catch (error) {
		try {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.setAttribute('readonly', '');
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			toast.success(successMessage, { icon: '🌟' });

			return true;
		} catch (fallbackError) {
			console.error('Copying to clipboard failed :>>', fallbackError);
			return false;
		}
	}
};
