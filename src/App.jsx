import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { private_routes, public_routes } from './routes';
import React, { lazy, useEffect } from 'react';
import { ProtectedRoute } from './layouts/components';
import { Suspense } from 'react';
import PropTypes from 'prop-types';

// Global css
import './index.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Tippy react css
import 'tippy.js/dist/tippy.css';

// NProgress css
import 'nprogress/nprogress.css';

// Tippy animations css
import 'tippy.js/animations/shift-toward.css';
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/animations/perspective.css';
import 'tippy.js/animations/scale.css';

// Sekeleton
import 'react-loading-skeleton/dist/skeleton.css';
import { useState } from 'react';

const TOAST_LIMIT = 3;

const fakeLoader = async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(null), 500));
};

const Home = lazy(() => import('./pages/Home'));
const NotFound404 = lazy(() => import('./pages/404'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
    const { toasts } = useToasterStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timerId = setTimeout(() => {
            setIsLoading(false);
        }, [4000]);
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            errorElement: (
                <MainLayout>
                    <Suspense fallback={null}>
                        <NotFound404 />
                    </Suspense>
                </MainLayout>
            ),
            loader: fakeLoader,
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={null}>
                            <Home />
                        </Suspense>
                    ),
                    loader: fakeLoader,
                },
                ...public_routes.map((route) => {
                    const { path, element: Element, loader } = route;
                    return {
                        path,
                        element: (
                            <Suspense fallback={null}>
                                <Element />
                            </Suspense>
                        ),
                        loader,
                    };
                }),
                ...private_routes.map((route) => {
                    const { path, element: Element, loader } = route;
                    return {
                        path,
                        element: (
                            <ProtectedRoute>
                                <Suspense fallback={null}>
                                    <Element />
                                </Suspense>
                            </ProtectedRoute>
                        ),
                        loader,
                    };
                }),
            ],
        },
        {
            path: '/login',
            element: (
                <Suspense fallback={null}>
                    <Login />
                </Suspense>
            ),
            loader: fakeLoader,
        },
        {
            path: '/register',
            element: (
                <Suspense fallback={null}>
                    <Register />
                </Suspense>
            ),
            loader: fakeLoader,
        },
    ]);

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts]);

    return (
        <React.Fragment>
            <InitalLoading
                className={`${isLoading ? 'opacity-100' : 'opacity-0'} pointer-events-none transition-opacity duration-500`}
            />
            <RouterProvider router={router} fallbackElement={<InitalLoading />} />
            <Toaster
                toastOptions={{
                    className:
                        'text-center text-sm lg:text-[15px] w-fit py-3 px-6 min-w-[120px] lg:min-w-[200px] border border-gray-400',
                    position: 'top-center',
                }}
                containerStyle={{
                    top: '5%',
                }}
            />
        </React.Fragment>
    );
}

const InitalLoading = ({ className = '' }) => {
    return (
        <div className={`fixed left-0 top-0 z-[999] h-screen w-screen bg-black ${className}`}>
            <svg
                id="logo"
                className="w-[200px] lg:w-[361px]"
                height="57"
                viewBox="0 0 361 57"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M331.333 52.9731L331.343 52.9777L331.353 52.9822C334.205 54.2053 337.38 54.8015 340.853 54.8015C344.53 54.8015 347.793 54.1049 350.593 52.6521L350.593 52.6521L350.603 52.6473C353.401 51.1707 355.574 49.2012 357.054 46.7212C358.556 44.2809 359.321 41.655 359.321 38.869C359.321 35.5363 358.539 32.702 356.817 30.5243C355.257 28.4482 353.314 26.8939 350.998 25.8921C348.88 24.9559 346.165 24.0379 342.877 23.1319L342.877 23.1319L342.869 23.1297C340.443 22.476 338.574 21.8805 337.239 21.346C336.001 20.8507 335.011 20.2102 334.235 19.4418C333.637 18.7672 333.303 17.8989 333.303 16.725C333.303 14.8704 333.894 13.6401 334.937 12.7985C336.074 11.8807 337.603 11.3625 339.651 11.3625C341.944 11.3625 343.629 11.9324 344.852 12.9333C346.132 13.9816 346.746 15.1544 346.852 16.4893L346.961 17.8713H348.347H357.255H358.879L358.751 16.2524C358.39 11.7204 356.511 8.06512 353.09 5.42737C349.752 2.76971 345.513 1.5 340.499 1.5C336.984 1.5 333.824 2.09468 331.052 3.32738C328.272 4.56377 326.06 6.36724 324.474 8.74786C322.879 11.1432 322.102 13.9158 322.102 17.008C322.102 20.2982 322.862 23.1051 324.534 25.28C326.087 27.3011 327.975 28.831 330.195 29.8356L330.214 29.8444L330.234 29.8527C332.347 30.738 335.035 31.6073 338.277 32.466L338.277 32.4661L338.284 32.468C340.805 33.122 342.715 33.7166 344.043 34.2481L344.05 34.2512L344.058 34.2542C345.328 34.7461 346.327 35.4237 347.095 36.2696L347.108 36.2831L347.12 36.2963C347.804 37.0126 348.19 37.9656 348.19 39.2935C348.19 40.9923 347.593 42.3202 346.377 43.3937C345.177 44.4074 343.4 45.0098 340.853 45.0098C338.423 45.0098 336.73 44.3964 335.577 43.3548C334.409 42.2577 333.738 40.8664 333.58 39.09L333.459 37.7228H332.086H323.46H321.96V39.2228C321.96 42.3356 322.796 45.1217 324.5 47.5202C326.18 49.8845 328.476 51.6971 331.333 52.9731Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M307.044 24.578V23.078H305.544H290.075V11.6455H307.665H309.165V10.1455V3.56598V2.06598H307.665H280.516H279.016V3.56598V52.8063V54.3063H280.516H307.665H309.165V52.8063V46.2268V44.7268H307.665H290.075V32.6575H305.544H307.044V31.1575V24.578Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M252.997 53.5542L253.429 54.3063H254.297H263.912H266.554L265.2 52.0376L254.034 33.3274C257.237 32.2309 259.772 30.473 261.529 27.9948C263.592 25.1029 264.635 21.8752 264.635 18.3522C264.635 15.3676 263.912 12.627 262.45 10.1666C261.01 7.66263 258.818 5.70816 255.963 4.27868C253.108 2.82527 249.68 2.13674 245.742 2.13674H228.774H227.274V3.63674V52.8063V54.3063H228.774H236.834H238.334V52.8063V34.6385H242.117L252.997 53.5542ZM251.485 23.36L251.477 23.3681L251.468 23.3762C250.341 24.5048 248.527 25.2005 245.742 25.2005H238.334V11.7163H245.742C248.594 11.7163 250.434 12.3982 251.556 13.4865L251.565 13.495L251.574 13.5034C252.712 14.5714 253.363 16.1169 253.363 18.3522C253.363 20.5704 252.698 22.1826 251.485 23.36Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M182.379 3.63674V2.13674H180.879H172.819H171.319V3.63674V34.8364C171.319 39.0577 172.214 42.7383 174.084 45.805C175.928 48.8305 178.433 51.1082 181.578 52.6044L181.578 52.6044L181.586 52.6084C184.726 54.078 188.175 54.8015 191.908 54.8015C195.642 54.8015 199.09 54.078 202.23 52.6084C205.419 51.116 207.97 48.8433 209.865 45.8206C211.788 42.7513 212.71 39.0648 212.71 34.8364V3.63674V2.13674H211.21H203.15H201.65V3.63674V34.9779C201.65 38.4473 200.733 40.7984 199.145 42.311L199.139 42.3172L199.132 42.3236C197.559 43.86 195.248 44.7268 191.979 44.7268C188.77 44.7268 186.449 43.8665 184.819 42.3173C183.276 40.8063 182.379 38.4522 182.379 34.9779V3.63674Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M159.157 3.63674V2.13674H157.657H123.367H121.867V3.63674V10.2163V11.7163H123.367H135.017V52.8063V54.3063H136.517H144.577H146.077V52.8063V11.7163H157.657H159.157V10.2163V3.63674Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M89.8859 37.8838L99.6703 53.5991L100.111 54.3063H100.944H109.993H112.693L111.267 52.014L96.4889 28.2576L111.337 4.43005L112.766 2.13674H110.064H101.085H100.223L99.7888 2.88194L90.5793 18.6978L80.7245 2.84482L80.2843 2.13674H79.4505H70.4008H67.6987L69.1277 4.43005L83.976 28.2576L69.1978 52.014L67.7718 54.3063H70.4715H79.4505H80.3124L80.7464 53.5617L89.8859 37.8838Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M56.0163 3.63674V2.13674H54.5163H46.4563H44.9563V3.63674V52.8063V54.3063H46.4563H54.5163H56.0163V52.8063V3.63674Z"
                    stroke="white"
                    strokeWidth="2"
                />
                <path
                    d="M33.4167 3.63674V2.13674H31.9167H3H1.5V3.63674V52.8063V54.3063H3H11.0599H12.5599V52.8063V32.799H27.3212H28.8212V31.299V24.7195V23.2195H27.3212H12.5599V11.7163H31.9167H33.4167V10.2163V3.63674Z"
                    stroke="white"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
};

InitalLoading.propTypes = {
    className: PropTypes.string,
};

export default App;
