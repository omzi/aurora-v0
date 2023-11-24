import { create } from 'zustand';

type ConfirmleaveStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useConfirmLeave = create<ConfirmleaveStore>((set, get) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false })
}));
