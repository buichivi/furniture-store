import { Shop, Product, Profile, productLoader, Cart, Checkout, Search, Wishlist, ProductTag, Brand } from '../pages';
const fakeLoader = async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(null), 500));
};

const public_routes = [
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
    {
        path: '/search/:query',
        element: Search,
        loader: fakeLoader,
    },

    {
        path: '/tag/:tag',
        element: ProductTag,
        loader: fakeLoader,
    },
    {
        path: '/brand/:brand',
        element: Brand,
        loader: fakeLoader,
    },
];

const private_routes = [
    {
        path: '/profile',
        element: Profile,
    },
    {
        path: '/wishlist',
        element: Wishlist,
        loader: fakeLoader,
    },
];

export { public_routes, private_routes };
