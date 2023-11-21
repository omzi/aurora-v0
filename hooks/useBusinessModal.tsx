import { create } from 'zustand';

type BusinessModalStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useBusinessModal = create<BusinessModalStore>((set, get) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false })
}));
