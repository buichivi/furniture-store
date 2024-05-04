import { create } from 'zustand';

const useAuthStore = create((set) => ({
    currentUser: null,
    token: null,
    loginUser: (user) => {
        set({ currentUser: user });
    },
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    logout: () => {
        localStorage.setItem('token', null);
        set({ currentUser: null, token: null });
    },
}));

export default useAuthStore;
