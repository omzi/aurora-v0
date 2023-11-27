import { create } from 'zustand';

type CustomerModalStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	isEditMode: boolean;
	toggleEditOpen: () => void;
}

export const useCustomerModal = create<CustomerModalStore>((set, get) => ({
	isOpen: false,
	isEditMode: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ 
		isOpen: false,
		isEditMode: false
	 }),
	toggleEditOpen: () => set({
		isEditMode: true,
		isOpen: true
	})
}));
