import { create } from "zustand";

export const useProductQuickViewStore = create((set) => ({
    product: null,
    isOpen: false,
    setProduct: (product) => set(() => ({ product: product })),
    toggleOpen: (state) => set(() => ({ isOpen: state })),
}));
