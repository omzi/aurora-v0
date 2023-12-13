import { create } from 'zustand';

type InvoiceExitStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useInvoiceExit = create<InvoiceExitStore>((set, get) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false })
}));
