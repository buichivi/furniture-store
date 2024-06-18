import { create } from 'zustand';

const cartInit = JSON.parse(localStorage.getItem('cart')) || { items: [] };

const useCartStore = create((set) => ({
    cart: cartInit,
    setCart: (_cart) => {
        localStorage.setItem('cart', JSON.stringify(_cart));
        set(() => ({ cart: _cart }));
    },
}));
export default useCartStore;
