import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { SuccessResponse, ErrorResponse } from '#/common.types';
 
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const isBase64Image = (imageData: string) => {
  return /^data:image\/(png|jpe?g|gif|webp);base64,/.test(imageData);
}

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
      message: error.message ?? 'An error occurred while performing an action ;('
    };
  }
}

export const generateDefaultAvatar = (seed: string) => {
  return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
}

export const generateRandomChars = (() => {
  const generateChars = (min: number, max: number): string[] =>
    Array.from({ length: max - min + 1 }, (_, i) => String.fromCharCode(min + i));

  const sets = {
    numeric: generateChars(48, 57),
    lowerCase: generateChars(97, 122),
    upperCase: generateChars(65, 90),
    special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
    alphanumeric: [...generateChars(48, 57), ...generateChars(65, 90), ...generateChars(97, 122)]
  };

  const iter = function* (len: number, set: string[] | undefined): Generator<string, void, unknown> {
    if (set && set.length < 1) set = Object.values(sets).flat();
    for (let i = 0; i < len; i++) yield set![Math.random() * set!.length | 0];
  };

  return Object.assign(((len: number, ...set: string[]) => [...iter(len, set.flat())].join('')), sets);
})();

export const getInitials = (name: string): string => {
  const [first, second = ''] = name.split(' ');

  return (first + second).toUpperCase();
}

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
