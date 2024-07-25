import { lazy } from 'react';
import { productLoader, blogLoader } from './loader';

const fakeLoader = async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(null), 500));
};

const Shop = lazy(() => import('../pages/Shop'));
const Product = lazy(() => import('../pages/Product'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const MyAccount = lazy(() => import('../pages/MyAccount'));
const Blogs = lazy(() => import('../pages/Blogs'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));

const public_routes = [
    {
        path: 'product/:productSlug',
        element: Product,
        loader: productLoader,
    },
    {
        path: 'shop/:categorySlug',
        element: Shop,
        loader: fakeLoader,
    },

    {
        path: 'shop',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: 'cart',
        element: Cart,
        loader: fakeLoader,
    },
    {
        path: 'checkout',
        element: Checkout,
        loader: fakeLoader,
    },
    {
        path: 'search/:query',
        element: Shop,
        loader: fakeLoader,
    },

    {
        path: 'tag/:tag',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: 'brand/:brand',
        element: Shop,
        loader: fakeLoader,
    },
    {
        path: 'blogs/:blogSlug',
        element: BlogDetail,
        loader: blogLoader,
    },
    {
        path: 'blogs',
        element: Blogs,
        loader: fakeLoader,
    },
];

const private_routes = [
    {
        path: 'wishlist',
        element: Wishlist,
        loader: fakeLoader,
    },
    {
        path: 'account/:option',
        element: MyAccount,
        loader: fakeLoader,
    },
];

export { public_routes, private_routes };
