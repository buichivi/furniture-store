import { useEffect, useRef } from 'react';
import { CartShortForm, SearchShortForm } from '../../components';
import { Link, useNavigation, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiRequest from '../../utils/apiRequest';
import Tippy from '@tippyjs/react/headless';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import nProgress from 'nprogress';
import useDataStore from '../../store/dataStore';

nProgress.configure({
    showSpinner: false,
});

const getCategoryTreeForHeader = (categories) => {
    return categories;
};

const Header = () => {
    const { blogSlug } = useParams();
    const navigation = useNavigation();
    const header_el = useRef();
    const logo = useRef();
    const { currentUser, loginUser, logout, token } = useAuthStore();
    const {
        products,
        wishlist,
        promoCode,
        setPromoCode,
        setCategories,
        setProducts,
        setWishlist,
        setBlogs,
        categoryTree,
    } = useDataStore();
    const { cart, setCart } = useCartStore();

    console.log('Header re-render');

    useEffect(() => {
        const styleHeader = () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                header_el.current.style.background = '#ffffffeb';
                if (!blogSlug) header_el.current.classList.add('shadow-lg');
            } else {
                if (top == 0) {
                    header_el.current.classList.remove('shadow-lg');
                    header_el.current.style.background = 'transparent';
                } else header_el.current.style.background = '#ffffffeb';
            }
        };
        window.addEventListener('scroll', styleHeader);
        return () => {
            window.removeEventListener('scroll', styleHeader);
        };
    }, []);

    useEffect(() => {
        Promise.allSettled([
            apiRequest.get('/auth/me', {
                headers: { Authorization: 'Bearer ' + token },
            }),
            apiRequest.get('/categories'),
            apiRequest.get('/products'),
            apiRequest.get('/blogs'),
        ]).then((results) => {
            const user =
                results[0].status == 'fulfilled' && results[0].value.data.user;
            const categories =
                results[1].status == 'fulfilled' &&
                results[1].value.data.categories;
            const products =
                results[2].status == 'fulfilled' &&
                results[2].value.data.products;
            const blogs =
                results[3].status == 'fulfilled' && results[3].value.data.blogs;
            if (user) loginUser(user);
            else {
                loginUser({});
            }
            setCategories(categories);
            setProducts(products);
            setBlogs(blogs);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        apiRequest
            .get('/cart', {
                headers: { Authorization: 'Bearer ' + token },
                withCredentials: true,
            })
            .then((res) => setCart(res.data.cart))
            .catch((err) => console.log(err));
        if (currentUser?._id) {
            apiRequest
                .get('/wishlist', {
                    headers: { Authorization: 'Bearer ' + token },
                })
                .then((res) => setWishlist(res.data?.wishlist))
                .catch((err) => console.log(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id]);

    useEffect(() => {
        setProducts(products);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist]);

    useEffect(() => {
        apiRequest
            .get('/promo-code/' + promoCode?.code)
            .then(() => console.log('APPLY PROMO CODE SUCCESS'))
            .catch(() => setPromoCode({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        toast.promise(
            apiRequest.patch('/auth/logout', null, {
                headers: { Authorization: 'Bearer ' + token },
            }),
            {
                loading: 'Logout...',
                success: (res) => {
                    logout();
                    setCart({ items: [] });
                    setWishlist([]);
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

    console.dir(header_el.current);

    return (
        <>
            <div
                ref={header_el}
                className="fixed left-0 top-0 z-50 flex h-auto w-full items-center justify-center border-b bg-transparent transition-shadow duration-700"
            >
                <div className="container px-5">
                    <div className="relative flex h-header items-center justify-between gap-8 ">
                        <div className="relative flex items-center gap-4">
                            {/* <input
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
                                <div className="container relative mx-auto mt-content-top flex h-full gap-10 px-5 text-white">
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
                            </div> */}
                            <label
                                className="cursor-pointer text-xl hover:opacity-70"
                                htmlFor="search-short-form"
                            >
                                <i className="fa-light fa-magnifying-glass"></i>
                            </label>
                        </div>
                        <Link
                            to="/"
                            className="absolute left-1/2 z-50 flex h-full w-[130px] -translate-x-1/2 items-center justify-center overflow-hidden"
                        >
                            <img
                                ref={logo}
                                src="/images/logo.png"
                                alt=""
                                className="w-full object-fill transition-all duration-1000"
                            />
                        </Link>
                        <div className="flex items-center gap-8 [&>*>i]:cursor-pointer [&>*>i]:text-xl">
                            {!currentUser?.email ? (
                                <Link
                                    className="relative hover:opacity-70"
                                    to="/login"
                                >
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
                                                                    currentUser.avatar ||
                                                                    '/images/account-placeholder.jpg'
                                                                }
                                                                alt={
                                                                    currentUser.name
                                                                }
                                                                className="size-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 flex-col items-start justify-center text-sm">
                                                            <h4 className="font-semibold">
                                                                {currentUser.firstName +
                                                                    ' ' +
                                                                    currentUser.lastName}
                                                            </h4>
                                                            <p>
                                                                {
                                                                    currentUser.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to="/account/infomation"
                                                        className="flex items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]"
                                                    >
                                                        <span className="min-w-[20%] text-base">
                                                            <i className="fa-light fa-user"></i>
                                                        </span>
                                                        <span>Account</span>
                                                    </Link>
                                                    <div
                                                        className="flex cursor-pointer items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]"
                                                        onClick={handleLogout}
                                                    >
                                                        <span className="min-w-[20%] text-base">
                                                            <i className="fa-light fa-arrow-left-from-bracket"></i>
                                                        </span>
                                                        <span>Log out</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    >
                                        {/* <i className="fa-light fa-user cursor-pointer text-xl"></i> */}
                                        <div className="size-7 shrink-0 cursor-pointer overflow-hidden rounded-full">
                                            <img
                                                src={
                                                    currentUser.avatar ||
                                                    '/images/account-placeholder.jpg'
                                                }
                                                alt={currentUser.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </Tippy>
                                </div>
                            )}
                            <Link to="/wishlist" className="relative">
                                <i className="fa-light fa-heart hover:opacity-70"></i>
                                <div className="absolute -right-[45%] -top-[35%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white">
                                    <span className="text-sm">
                                        {wishlist?.length}
                                    </span>
                                </div>
                            </Link>
                            <label
                                className="relative"
                                htmlFor="cart-short-form"
                            >
                                <i className="fa-light fa-cart-shopping hover:opacity-70"></i>
                                <div className="absolute -right-[30%] -top-[35%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white">
                                    <span className="text-sm">
                                        {cart?.items?.length}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="h-nav relative flex w-full items-center justify-center">
                        {categoryTree.map((category) => {
                            return (
                                <div
                                    key={category?._id}
                                    className="[&:hover>a]:border-b-black [&:hover>div]:pointer-events-auto [&:hover>div]:translate-y-0 [&:hover>div]:opacity-100"
                                >
                                    <Link
                                        to={`/shop/${category?.slug}`}
                                        className="h-nav relative inline-block cursor-pointer border-b border-b-transparent px-4 py-2 font-inter text-sm font-bold uppercase tracking-wider transition-colors"
                                    >
                                        {category?.name}
                                    </Link>
                                    <div className="pointer-events-none absolute left-1/2 top-full flex h-auto w-[95%] -translate-x-1/2 translate-y-10 items-start gap-10 border bg-white opacity-0 shadow-md transition-all ">
                                        <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-10 pl-[5%] pt-[3%]">
                                            {category.child.map((child_lv2) => {
                                                return (
                                                    <div key={child_lv2?._id}>
                                                        <span className="text-sm font-bold uppercase">
                                                            {child_lv2?.name}
                                                        </span>
                                                        <ul className="mt-4">
                                                            {child_lv2.child.map(
                                                                (child_lv3) => {
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                child_lv3._id
                                                                            }
                                                                            className="py-1 font-light opacity-80 transition-all hover:opacity-100"
                                                                        >
                                                                            <Link
                                                                                to={`/shop/${child_lv3.slug}`}
                                                                            >
                                                                                {
                                                                                    child_lv3.name
                                                                                }
                                                                            </Link>
                                                                        </li>
                                                                    );
                                                                },
                                                            )}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex-1">
                                            <img
                                                src={category?.imageUrl}
                                                className="aspect-[1/0.8] w-full object-cover object-center"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Search */}
            <SearchShortForm />
            <CartShortForm />
        </>
    );
};

export default Header;
