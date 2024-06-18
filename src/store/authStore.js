import { create } from 'zustand';

const initUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const initToken = localStorage.getItem('token') || null;

const useAuthStore = create((set) => ({
    currentUser: initUser,
    token: initToken,
    loginUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ currentUser: user });
    },
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    logout: () => {
        localStorage.setItem('currentUser', null);
        localStorage.setItem('token', null);
        set({ currentUser: null, token: null });
    },
}));

export default useAuthStore;
