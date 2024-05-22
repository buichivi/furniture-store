import { create } from 'zustand';

const useCartStore = create((set) => ({
    cart: {},
    setCart: (_cart) => set(() => ({ cart: _cart })),
}));
export default useCartStore;
