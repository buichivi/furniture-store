import { Home, Shop, Product } from "../pages";
// import TryZustand from "../pages/TryZustand";

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
    // {
    //     path: "/test",
    //     element: TryZustand,
    // },
];

export { public_routes };
