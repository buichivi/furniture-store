import { useEffect, useRef } from 'react';
import { CartShortForm, SearchItem } from '../../components';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiRequest from '../../utils/apiRequest';
import Tippy from '@tippyjs/react/headless';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import nProgress from 'nprogress';
import useCategoryStore from '../../store/navigationStore';

const NAV_ITEMS = [
    {
        name: 'HOME',
        path: '/',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'SHOP',
        path: '/shop',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'COLLECTIONS',
        path: '/collections',
        image: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'BLOG',
        path: '/blog',
        image: 'https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'ABOUT US',
        path: '/about-us',
        image: 'https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

nProgress.configure({
    showSpinner: false,
});

const Header = () => {
    const navigation = useNavigation();
    const navigate = useNavigate();
    const header_el = useRef();
    const logo = useRef();
    const inputToggleMenu = useRef();
    const imageRef = useRef();
    const { currentUser, loginUser, logout } = useAuthStore();
    const { setCategories } = useCategoryStore();
    const { cart, setCart } = useCartStore();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const styleHeader = () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                header_el.current.style.background = 'white';
                header_el.current.classList.add('shadow-lg');
            } else {
                if (top == 0) {
                    header_el.current.classList.remove('shadow-lg');
                    header_el.current.style.background = 'transparent';
                } else header_el.current.style.background = 'white';
            }
        };
        window.addEventListener('scroll', styleHeader);
        return () => {
            window.removeEventListener('scroll', styleHeader);
        };
    }, []);

    useEffect(() => {
        Promise.allSettled([apiRequest.get('/auth/me'), apiRequest.get('/categories')]).then((results) => {
            const user = results[0].status == 'fulfilled' && results[0].value.data.user;
            const categories = results[1].status == 'fulfilled' && results[1].value.data.categories;
            loginUser(user);
            setCategories(categories);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        apiRequest
            .get('/cart', { headers: { Authorization: 'Bearer ' + token }, withCredentials: true })
            .then((res) => setCart(res.data.cart))
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleLogout = () => {
        toast.promise(
            apiRequest.patch('/auth/logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            {
                loading: 'Logout...',
                success: (res) => {
                    logout();
                    navigate('/');
                    return res.data.message;
                },
                error: (err) => {
                    return err.response.data.error || 'Something went wrong';
                },
            },
        );
    };

    useEffect(() => {
        if (navigation.state == 'loading') {
            nProgress.start();
        } else {
            nProgress.done();
        }
    }, [navigation.state]);

    return (
        <>
            <div
                ref={header_el}
                className="fixed left-0 top-0 z-50 flex h-[90px] w-full items-center justify-center bg-transparent transition-shadow duration-700"
            >
                <div className="container flex items-center justify-between gap-8 px-5">
                    <div className="relative flex items-center gap-4">
                        <input
                            type="checkbox"
                            id="menu"
                            className="peer/menu hidden [&:checked+.menu-clip-path]:!delay-0 [&:checked+div_.nav-item-image]:top-0 [&:checked+div_.nav-item-image]:!delay-[600ms] [&:checked+div_.nav-item-image]:!duration-700 [&:checked+div_span.nav-item]:top-0 [&:checked+div_span.nav-item]:!delay-[600ms] [&:checked+div_span.nav-item]:!duration-500"
                            onChange={(e) => {
                                const isOpen = e.currentTarget.checked;
                                const menuIcon = e.currentTarget.nextElementSibling.nextElementSibling.children[0];
                                if (isOpen) {
                                    logo.current.classList.add('invert');
                                    menuIcon.setAttribute('aria-checked', 'true');
                                } else {
                                    logo.current.classList.remove('invert');
                                    menuIcon.setAttribute('aria-checked', 'false');
                                }
                            }}
                            ref={inputToggleMenu}
                        />
                        <div
                            className={`menu-clip-path fixed left-0 top-0 z-20 size-full overflow-hidden bg-black !delay-500`}
                        >
                            <div className="container relative mx-auto mt-[90px] flex h-full gap-10 px-5 text-white">
                                <div className="flex flex-col gap-6 [&>*]:font-lora [&>*]:text-5xl [&>*]:font-medium [&>*]:uppercase">
                                    {NAV_ITEMS.map((item, index) => {
                                        return (
                                            <div
                                                className="relative w-fit overflow-hidden before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-0 before:bg-white before:transition-all before:duration-500 before:content-[''] hover:before:left-0 hover:before:w-full"
                                                key={index}
                                            >
                                                <span
                                                    to={item.path}
                                                    className={`nav-item relative top-full cursor-pointer transition-all !delay-300 !duration-300 ease-[cubic-bezier(0.86_0_0.07_1)] `}
                                                    onClick={(e) => {
                                                        navigate(item.path);
                                                        if (navigation.state == 'idle') {
                                                            const menuIcon =
                                                                e.currentTarget.parentElement.parentElement
                                                                    .parentElement.parentElement.nextElementSibling
                                                                    .children[0];
                                                            menuIcon.setAttribute('aria-checked', 'false');
                                                            logo.current.classList.remove('invert');
                                                            inputToggleMenu.current.checked =
                                                                !inputToggleMenu.current.checked;
                                                        }
                                                    }}
                                                    onMouseEnter={() => {
                                                        Array.from(imageRef.current.children).forEach((child, idx) => {
                                                            if (idx == index) {
                                                                child.style.opacity = 1;
                                                            } else child.style.opacity = 0;
                                                        });
                                                    }}
                                                    onMouseLeave={() => {}}
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="relative flex-1 overflow-hidden" ref={imageRef}>
                                    {NAV_ITEMS.map(({ image }, index) => {
                                        return (
                                            <img
                                                key={index}
                                                src={image}
                                                alt=""
                                                className={`nav-item-image absolute top-full size-full object-cover transition-all !delay-300 !duration-500 ease-[cubic-bezier(0.86_0_0.07_1)]`}
                                                style={{ opacity: index == 0 ? 1 : 0 }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="cross menu--1 relative size-10 overflow-hidden">
                            <label
                                className="absolute -left-[30px] top-1/2 z-50 size-20 -translate-y-1/2 cursor-pointer hover:opacity-70"
                                htmlFor="menu"
                                aria-checked="false"
                            >
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path className="line--1" d="M0 40h62c13 0 6 28-4 18L35 35" />
                                    <path className="line--2" d="M0 50h70" />
                                    <path className="line--3" d="M0 60h62c13 0 6-28-4-18L35 65" />
                                </svg>
                            </label>
                        </div>
                        <label className="cursor-pointer text-xl hover:opacity-70" htmlFor="search-short-form">
                            <i className="fa-light fa-magnifying-glass"></i>
                        </label>
                    </div>
                    <Link
                        to="/"
                        className="absolute left-1/2 z-50 flex h-full w-[150px] -translate-x-1/2 items-center justify-center"
                    >
                        <img
                            ref={logo}
                            src="/images/logo.png"
                            alt=""
                            className="w-full object-fill transition-all duration-1000"
                        />
                    </Link>
                    <div className="flex items-center gap-8 [&>*>i]:cursor-pointer [&>*>i]:text-xl">
                        {!currentUser ? (
                            <Link className="relative hover:opacity-70" to="/login">
                                <i className="fa-light fa-user"></i>
                            </Link>
                        ) : (
                            <div>
                                <Tippy
                                    interactive
                                    arrow={true}
                                    placement="bottom"
                                    delay={[0, 500]}
                                    render={(attrs) => {
                                        return (
                                            <div
                                                className="flex flex-col border bg-white  py-2 shadow-lg"
                                                tabIndex="-1"
                                                {...attrs}
                                            >
                                                <div className="flex items-center gap-2 border-b px-4 py-2">
                                                    <div className="size-10 shrink-0 overflow-hidden rounded-full">
                                                        <img
                                                            src={
                                                                currentUser.avatar || '/images/account-placeholder.jpg'
                                                            }
                                                            alt={currentUser.name}
                                                            className="size-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-start justify-center text-sm">
                                                        <h4 className="font-semibold">
                                                            {currentUser.firstName + ' ' + currentUser.lastName}
                                                        </h4>
                                                        <p>{currentUser.email}</p>
                                                    </div>
                                                </div>
                                                <Link className="flex items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]">
                                                    <span className="min-w-[20%] text-base">
                                                        <i className="fa-light fa-user"></i>
                                                    </span>
                                                    My account
                                                </Link>
                                                <div
                                                    className="flex cursor-pointer items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]"
                                                    onClick={handleLogout}
                                                >
                                                    <span className="min-w-[20%] text-base">
                                                        <i className="fa-light fa-arrow-left-from-bracket"></i>
                                                    </span>
                                                    Log out
                                                </div>
                                            </div>
                                        );
                                    }}
                                >
                                    <i className="fa-light fa-user cursor-pointer text-xl"></i>
                                </Tippy>
                            </div>
                        )}
                        <Link className="relative">
                            <i className="fa-light fa-heart hover:opacity-70"></i>
                            <div className="absolute -right-[45%] -top-[35%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white">
                                <span className="text-sm">0</span>
                            </div>
                        </Link>
                        <label className="relative" htmlFor="cart-short-form">
                            <i className="fa-light fa-cart-shopping hover:opacity-70"></i>
                            <div className="absolute -right-[30%] -top-[35%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white">
                                <span className="text-sm">{cart?.items?.length}</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Search */}
            <input
                type="checkbox"
                className="peer/search-short-form hidden [&:checked+div>div]:translate-x-0 [&:checked+div>label]:opacity-100"
                id="search-short-form"
            />
            <div className="pointer-events-none invisible fixed right-0 top-0 z-50 h-screen w-screen peer-checked/search-short-form:pointer-events-auto peer-checked/search-short-form:visible">
                <label
                    htmlFor="search-short-form"
                    className="block h-full w-full bg-[#3f3f3f80] opacity-0 transition-all duration-500"
                ></label>
                <div className="absolute right-0 top-0 h-full w-[30%] translate-x-full overflow-y-auto bg-white p-[30px] transition-all duration-500 [scrollbar-width:thin] 2xl:w-1/5">
                    <div className="mb-8 flex items-center justify-between">
                        <h4>Search for products (0)</h4>
                        <label htmlFor="search-short-form" className="cursor-pointer text-2xl">
                            <i className="fa-light fa-xmark"></i>
                        </label>
                    </div>
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="h-[50px] w-full border border-gray-400 py-3 pl-4 pr-14 outline-none"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-lg">
                            <i className="fa-light fa-magnifying-glass"></i>
                        </span>
                    </div>
                    <div className="mb-8 flex flex-col gap-8">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => {
                            return <SearchItem key={index} />;
                        })}
                    </div>
                    <div className="text-center">
                        <Link className="hover-text-effect text-sm font-bold uppercase">
                            View all <span>6</span> results
                        </Link>
                    </div>
                </div>
            </div>
            <CartShortForm />
        </>
    );
};

export default Header;
