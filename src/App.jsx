import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Global css
import './index.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Tippy react css
import 'tippy.js/dist/tippy.css';

// Photoswipe css
import 'photoswipe/style.css';

// NProgress css
import 'nprogress/nprogress.css';

// Tippy animations css
import 'tippy.js/animations/shift-toward.css';
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/animations/perspective.css';
import 'tippy.js/animations/scale.css';

// Sekeleton
import 'react-loading-skeleton/dist/skeleton.css';

import MainLayout from './layouts/MainLayout';
import { ScrollToTop } from './components';
import { private_routes, public_routes } from './routes';
import { Home, Login, NotFound404, Register } from './pages';
import { useEffect } from 'react';
import { ProtectedRoute } from './layouts/components';

const TOAST_LIMIT = 3;

const fakeLoader = async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(null), 500));
};

function App() {
    const { toasts } = useToasterStore();

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <MainLayout>
                    <>
                        <ScrollToTop />
                        <Home />
                    </>
                </MainLayout>
            ),
            loader: fakeLoader,
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
            loader: fakeLoader,
        },
        {
            children: public_routes.map((route) => {
                const { path, element: Element, loader } = route;
                return {
                    path,
                    element: (
                        <MainLayout>
                            <>
                                <ScrollToTop />
                                <Element />
                            </>
                        </MainLayout>
                    ),
                    loader,
                };
            }),
        },
        {
            element: <ProtectedRoute />,
            children: private_routes.map((route) => {
                const { path, element: Element, loader } = route;
                return {
                    path,
                    element: (
                        <MainLayout>
                            <>
                                <ScrollToTop />
                                <Element />
                            </>
                        </MainLayout>
                    ),
                    loader,
                };
            }),
        },
        {
            path: '*',
            element: (
                <MainLayout>
                    <>
                        <ScrollToTop />
                        <NotFound404 />
                    </>
                </MainLayout>
            ),
        },
    ]);

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts]);

    return (
        <>
            <RouterProvider router={router} />
            <Toaster
                toastOptions={{
                    className:
                        'text-center text-[15px] w-fit py-3 px-6 min-w-[200px] border border-gray-400',
                    position: 'top-center',
                }}
                containerStyle={{
                    top: '5%',
                }}
            />
        </>
    );
}

export default App;
