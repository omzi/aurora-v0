import { create } from 'zustand';

import { Customer } from '#/common.types';

type CustomerModalStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	isEditMode: boolean;
	toggleEditMode: (customer: Customer) => void;
	customer: Customer | null;
};

export const useCustomerModal = create<CustomerModalStore>((set, get) => ({
	isOpen: false,
	isEditMode: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({
		isOpen: false,
		isEditMode: false,
		customer: null
	}),
	toggleEditMode: (customer: Customer) => set({
		isEditMode: true,
		isOpen: true,
		customer
	}),
	customer: null
}));
