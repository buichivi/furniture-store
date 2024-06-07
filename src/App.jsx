import { Toaster } from 'react-hot-toast';
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

    return (
        <>
            <RouterProvider router={router} />
            <Toaster
                toastOptions={{
                    className: 'text-sm',
                    position: 'top-center',
                }}
            />
        </>
    );
}

export default App;
