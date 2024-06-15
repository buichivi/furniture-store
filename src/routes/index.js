import { Home, Shop, Product, Profile, productLoader, Cart, Checkout } from '../pages';
const fakeLoader = async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(null), 500));
};

const public_routes = [
    {
        path: '/',
        element: Home,
        loader: fakeLoader,
    },
    {
        path: '/shop/:parentCategorySlug/:categorySlug/:productSlug',
        element: Product,
        loader: productLoader,
    },
    {
        path: '/shop/:parentCategorySlug/:categorySlug',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: '/shop/:parentCategorySlug',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: '/shop',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: '/cart',
        element: Cart,
        loader: fakeLoader,
    },
    {
        path: '/checkout',
        element: Checkout,
        loader: fakeLoader,
    },
];

const private_routes = [
    {
        path: '/profile',
        element: Profile,
    },
];

export { public_routes, private_routes };
