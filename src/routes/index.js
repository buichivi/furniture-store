import { Home, Shop, Product } from "../pages";

const public_routes = [
    {
        path: "/",
        element: Home,
    },
    {
        path: "/shop",
        element: Shop,
    },
    {
        path: "/product",
        element: Product,
    },
];

export { public_routes };
