import { create } from 'zustand';
const initCompares = JSON.parse(localStorage.getItem('compareProducts')) || [];

export const useCompareProductsStore = create((set) => ({
    compareProducts: initCompares,
    isOpen: false,
    setCompares: (_compares) => {
        localStorage.setItem('compareProducts', JSON.stringify(_compares));
        set(() => ({ compareProducts: _compares }));
    },
    toggleOpen: (state) => set(() => ({ isOpen: state })),
}));
