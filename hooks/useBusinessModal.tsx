import { create } from 'zustand';

type BusinessModalStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	isEditMode: boolean;
	toggleEditOpen: () => void;
};

export const useBusinessModal = create<BusinessModalStore>((set, get) => ({
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
