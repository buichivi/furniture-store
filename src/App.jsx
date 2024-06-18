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

import MainLayout from './layouts/MainLayout';
import { ScrollToTop } from './components';
import { public_routes } from './routes';
import { Login, Register } from './pages';
import { useEffect } from 'react';

function App() {
    const router = createBrowserRouter([
        ...public_routes.map((route) => {
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
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },
    ]);
    const { toasts } = useToasterStore();

    const TOAST_LIMIT = 3;

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
                    className: 'text-sm text-center w-fit',
                    position: 'top-center',
                }}
            />
        </>
    );
}

export default App;
