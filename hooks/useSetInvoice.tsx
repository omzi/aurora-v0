import {create} from 'zustand';

type Actions = {
    setDescription: (description: string) => void,
    setQuantity: (quantity: number) => void,
    setPrice: (price: number) => void,
    setTotal: () => void,
    reset: () => void
}

type Invoice = {
    id?: number | string,
    description: string,
    quantity: number,
    price: number,
    total: number,
}

type InvoiceState = {
    InvoiceItems: Invoice[],
    totalCost: number
}

type InvoiceActions = {
    setInvoiceItems: (invoice: Invoice) => void,
    setTotalCost: (n: number) => void,
    resetInvoice: () => void
}



const initialInvoice : Invoice = {
    description: '',
    quantity: 0,
    price: 0,
    total: 0,
}

export const useSetInvoice = create<Invoice & Actions>()((set) => ({
    ... initialInvoice,
    setDescription: (description) => set({ description }),
    setQuantity: (quantity) => set({ quantity}),
    setPrice: (price) => set({ price }),
    setTotal: () => set((state) => ({ total: state.quantity * state.price})),
    reset: () => {set(initialInvoice)}
}));

export const useInvoiceItems = create<InvoiceState & InvoiceActions>()((set) => ({
    InvoiceItems: [],
    totalCost: 0,
    setInvoiceItems: (newInvoiceItem) => set((state) => ({ InvoiceItems: [...state.InvoiceItems, newInvoiceItem] })),
    setTotalCost: (n) =>  set((state) => ({totalCost: state.totalCost + n})),
    resetInvoice: () => {set({InvoiceItems: [], totalCost: 0})} 
}))