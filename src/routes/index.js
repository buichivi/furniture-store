import { Home, Shop, Product, Profile } from '../pages';
// import TryZustand from "../pages/TryZustand";

const public_routes = [
    {
        path: '/',
        element: Home,
    },
    {
        path: '/shop',
        element: Shop,
    },
    {
        path: '/product',
        element: Product,
    },
    // {
    //     path: "/test",
    //     element: TryZustand,
    // },
];

const private_routes = [
    {
        path: '/profile',
        element: Profile,
    },
];

export { public_routes, private_routes };
