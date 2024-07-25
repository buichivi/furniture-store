import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigation, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiRequest from '../../utils/apiRequest';
import Tippy from '@tippyjs/react/headless';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import nProgress from 'nprogress';
import useDataStore from '../../store/dataStore';
import {
    ArrowLeftEndOnRectangleIcon,
    MagnifyingGlassIcon,
    MinusIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import CartShortForm from '../../components/CartShortForm';
import Search from '../../components/Search';

nProgress.configure({
    showSpinner: false,
});

const Header = () => {
    const { blogSlug, categorySlug } = useParams();
    const navigation = useNavigation();
    const location = useLocation();
    const header_el = useRef();
    const logo = useRef();
    const { currentUser, loginUser, logout, token } = useAuthStore();
    const [isOpenMenuMobile, setIsOpenMenuMobile] = useState(false);
    const [isOpenSearchMobile, setIsOpenSearchMobile] = useState(false);
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

    useEffect(() => {
        setIsOpenMenuMobile(false);
    }, [location]);

    console.log('Header re-render');

    useEffect(() => {
        const styleHeader = () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                header_el.current.style.background = '#ffffffeb';
                if (!blogSlug && !categorySlug) {
                    header_el.current.classList.add('shadow-lg');
                }
            } else {
                if (top == 0) {
                    if (header_el.current.classList.contains('shadow-lg'))
                        header_el.current.classList.remove('shadow-lg');
                    header_el.current.style.background = 'transparent';
                } else {
                    header_el.current.style.background = '#ffffffeb';
                }
            }
        };
        window.addEventListener('scroll', styleHeader);
        return () => {
            window.removeEventListener('scroll', styleHeader);
        };
    }, [blogSlug, categorySlug, location]);

    useEffect(() => {
        Promise.allSettled([
            apiRequest.get('/auth/me', {
                headers: { Authorization: 'Bearer ' + token },
            }),
            apiRequest.get('/categories'),
            apiRequest.get('/products'),
            apiRequest.get('/blogs'),
        ]).then((results) => {
            const user = results[0].status == 'fulfilled' && results[0].value.data.user;
            const categories = results[1].status == 'fulfilled' && results[1].value.data.categories;
            const products = results[2].status == 'fulfilled' && results[2].value.data.products;
            const blogs = results[3].status == 'fulfilled' && results[3].value.data.blogs;
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
        if (promoCode?.code) {
            apiRequest
                .get('/promo-code/' + promoCode.code)
                .then(() => console.log('APPLY PROMO CODE SUCCESS'))
                .catch(() => setPromoCode({}));
        }
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

    return (
        <React.Fragment>
            <div
                ref={header_el}
                className="fixed left-0 top-0 z-50 flex h-auto w-full items-center justify-center border-b bg-transparent transition-shadow duration-700"
            >
                <div className="container px-5">
                    <div className="relative flex h-16 items-center justify-between gap-8 lg:h-header">
                        <Search className="hidden w-[30%] lg:inline-block" />

                        <div className="flex items-center gap-4 lg:hidden">
                            <div
                                className={`menu menu--close5 ${isOpenMenuMobile ? 'open' : ''}`}
                                onClick={(e) => {
                                    e.currentTarget.classList.toggle('open');
                                    setIsOpenMenuMobile(!isOpenMenuMobile);
                                }}
                            >
                                <div className="menu__icon">
                                    <div className="menu__line menu__line--1"></div>
                                    <div className="menu__line menu__line--2"></div>
                                    <div className="menu__line menu__line--3"></div>
                                    <div className="menu__line menu__line--4"></div>
                                    <div className="menu__line menu__line--5"></div>
                                </div>
                            </div>
                            <div>
                                <MagnifyingGlassIcon className="size-6" onClick={() => setIsOpenSearchMobile(true)} />
                                <input
                                    type="checkbox"
                                    checked={isOpenSearchMobile}
                                    onChange={(e) => setIsOpenSearchMobile(e.currentTarget.checked)}
                                    className="hidden [&:checked+div>div:last-child]:translate-y-0 [&:checked+div]:pointer-events-auto [&:checked+div]:opacity-100"
                                />
                                <div className="pointer-events-none fixed left-0 top-0 z-[60] size-full opacity-0 transition-all">
                                    <div
                                        className="absolute left-0 top-0 size-full bg-[#0000008c]"
                                        onClick={() => setIsOpenSearchMobile(false)}
                                    ></div>
                                    <div className="h-32 w-full -translate-y-full bg-white p-5 shadow-md transition-all duration-500">
                                        <div className="flex items-center justify-between">
                                            <span className="font-lora text-xl">Search</span>
                                            <XMarkIcon
                                                className="size-6"
                                                onClick={() => setIsOpenSearchMobile(false)}
                                            />
                                        </div>
                                        <Search className="mt-4 w-full" />
                                    </div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={isOpenMenuMobile}
                                onChange={(e) => setIsOpenMenuMobile(e.currentTarget.checked)}
                                className="hidden [&:checked+div>div:last-child]:left-0 [&:checked+div]:pointer-events-auto [&:checked+div]:opacity-100"
                            />
                            <div className="pointer-events-none fixed left-0 top-0 -z-[1] mt-16 size-full opacity-0 transition-all duration-300">
                                <div
                                    className="absolute left-0 top-0 size-full bg-[#00000062]"
                                    onClick={() => setIsOpenMenuMobile(false)}
                                ></div>
                                <div className="relative -left-full flex h-[calc(100vh_-_64px)] w-4/5 flex-col justify-between bg-white transition-all duration-500">
                                    <div className="max-h-[75%] flex-1 overflow-auto p-5">
                                        <Menu
                                            categoryTree={[
                                                ...categoryTree,
                                                {
                                                    _id: 'blogs',
                                                    slug: 'blogs',
                                                    name: 'Blogs',
                                                    child: [],
                                                    isCustom: true,
                                                },
                                            ]}
                                            isMobile={true}
                                        />
                                    </div>
                                    <div className="max-h-[25%] bg-gray-200">
                                        <div className="flex items-center justify-between p-5">
                                            <Link
                                                to={!currentUser?._id ? '/login' : '/account/infomation'}
                                                className="flex items-center gap-2"
                                            >
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="size-5"
                                                        viewBox="0 0 32 32"
                                                    >
                                                        <path
                                                            fill="#000000"
                                                            d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="text-sm tracking-widest opacity-90">
                                                    {!currentUser?._id ? 'Customer Sign in/ Sign up' : 'Account'}
                                                </span>
                                            </Link>
                                            {currentUser?._id && (
                                                <div
                                                    className="flex items-center gap-2 text-sm tracking-widest opacity-90"
                                                    onClick={handleLogout}
                                                >
                                                    <ArrowLeftEndOnRectangleIcon className="size-5" />
                                                    <span>Log out</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/"
                            className="absolute left-1/2 z-50 flex h-full w-24 -translate-x-1/2 items-center justify-center overflow-hidden lg:w-[130px]"
                        >
                            <img
                                ref={logo}
                                src="/images/logo.png"
                                alt=""
                                className="w-full object-fill transition-all duration-1000"
                            />
                        </Link>
                        <div className="flex items-center gap-6 lg:gap-7 [&>*>i]:cursor-pointer [&>*>i]:text-lg lg:[&>*>i]:text-xl">
                            {!currentUser?.email ? (
                                <Link className="relative hidden hover:opacity-70 lg:inline-block" to="/login">
                                    {/* <i className="fa-light fa-user"></i> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 32 32">
                                        <path
                                            fill="#000000"
                                            d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
                                        />
                                    </svg>
                                </Link>
                            ) : (
                                <div className="hidden lg:inline-block">
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
                                                    <Link
                                                        to="/account/infomation"
                                                        className="flex items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]"
                                                    >
                                                        <span className="min-w-[20%] text-base">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="size-5"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <path
                                                                    fill="#000000"
                                                                    d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span>Account</span>
                                                    </Link>
                                                    <div
                                                        className="flex cursor-pointer items-center px-5 py-2 text-sm transition-colors hover:bg-[#eeeeee6e]"
                                                        onClick={handleLogout}
                                                    >
                                                        <span className="min-w-[20%] text-base">
                                                            <ArrowLeftEndOnRectangleIcon className="size-5" />
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
                                                src={currentUser.avatar || '/images/account-placeholder.jpg'}
                                                alt={currentUser.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </Tippy>
                                </div>
                            )}
                            <Link to="/wishlist" className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-6 cursor-pointer hover:opacity-70"
                                    viewBox="0 0 256 256"
                                >
                                    <path
                                        fill="#000000"
                                        d="M178 40c-20.65 0-38.73 8.88-50 23.89C116.73 48.88 98.65 40 78 40a62.07 62.07 0 0 0-62 62c0 70 103.79 126.66 108.21 129a8 8 0 0 0 7.58 0C136.21 228.66 240 172 240 102a62.07 62.07 0 0 0-62-62m-50 174.8c-18.26-10.64-96-59.11-96-112.8a46.06 46.06 0 0 1 46-46c19.45 0 35.78 10.36 42.6 27a8 8 0 0 0 14.8 0c6.82-16.67 23.15-27 42.6-27a46.06 46.06 0 0 1 46 46c0 53.61-77.76 102.15-96 112.8"
                                    />
                                </svg>
                                {wishlist?.length > 0 && (
                                    <div className="absolute -right-[55%] -top-[35%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white lg:-right-[45%] lg:-top-[35%]">
                                        <span className="text-xs lg:text-sm">{wishlist?.length}</span>
                                    </div>
                                )}
                            </Link>
                            <label className="relative" htmlFor="cart-short-form">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-[28px] cursor-pointer hover:opacity-70"
                                    viewBox="0 0 256 256"
                                >
                                    <path
                                        fill="black"
                                        d="M216 66h-42v-2a46 46 0 0 0-92 0v2H40a14 14 0 0 0-14 14v120a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V80a14 14 0 0 0-14-14M94 64a34 34 0 0 1 68 0v2H94Zm124 136a2 2 0 0 1-2 2H40a2 2 0 0 1-2-2V80a2 2 0 0 1 2-2h42v18a6 6 0 0 0 12 0V78h68v18a6 6 0 0 0 12 0V78h42a2 2 0 0 1 2 2Z"
                                    />
                                </svg>
                                {cart?.items?.length > 0 && (
                                    <div className="absolute -right-[40%] -top-[25%] flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white lg:-right-[35%] lg:-top-[24%]">
                                        <span className="text-xs lg:text-sm">{cart?.items?.length}</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="relative hidden h-nav w-full items-center justify-center lg:flex">
                        <Menu categoryTree={categoryTree} />
                        <div className="[&:hover>a]:border-b-black [&:hover>div]:pointer-events-auto [&:hover>div]:translate-y-0 [&:hover>div]:opacity-100">
                            <Link
                                to={`/blogs`}
                                className="relative inline-block h-nav cursor-pointer border-b border-b-transparent px-4 py-2 font-inter text-sm font-bold uppercase tracking-wider transition-colors"
                            >
                                Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <CartShortForm />
        </React.Fragment>
    );
};

function addIsOpenToCategoryTree(categoryTree) {
    // Duyệt qua từng category trong categoryTree
    categoryTree.forEach((category) => {
        // Thêm thuộc tính isOpen với giá trị mặc định là true (hoặc false tùy ý)
        category.isOpen = false; // Giả sử mặc định là true
        // Nếu category có child, gọi đệ quy để thêm isOpen vào các child
        if (category.child && category.child.length > 0) {
            addIsOpenToCategoryTree(category.child); // Đệ quy vào các child
        }
    });
    return categoryTree; // Trả về chính categoryTree đã được thêm isOpen
}
function setOpenStatusById(categoryTree, id, isOpen) {
    // Duyệt qua từng category trong categoryTree
    categoryTree.forEach((category) => {
        // Nếu _id của category trùng với id được truyền vào
        if (category._id === id) {
            category.isOpen = isOpen; // Thay đổi giá trị isOpen thành giá trị mới
            return categoryTree; // Trả về categoryTree sau khi chỉnh sửa
        }
        // Nếu category có child, gọi đệ quy để tìm trong các child
        if (category.child && category.child.length > 0) {
            setOpenStatusById(category.child, id, isOpen); // Đệ quy cho các child
        }
    });
    return categoryTree; // Trả về categoryTree sau khi duyệt xong
}
const Menu = ({ categoryTree = [], isMobile = false }) => {
    const [categories, setCategories] = useState(categoryTree);

    useEffect(() => {
        setCategories(addIsOpenToCategoryTree(categoryTree));
    }, [categoryTree]);

    const handleToggleOpen = (category, isOpen) => {
        // Tạo một bản sao mới của categories với isOpen đã được cập nhật
        const updatedCategories = setOpenStatusById([...categories], category._id, isOpen);

        // Cập nhật state categories với bản sao mới đã cập nhật
        setCategories(updatedCategories);
    };

    return (
        <React.Fragment>
            {categories.map((category) => {
                return (
                    <div
                        key={category?._id}
                        className="[&:hover>a]:border-b-black [&:hover>div]:pointer-events-auto [&:hover>div]:translate-y-0 [&:hover>div]:opacity-100"
                    >
                        {!isMobile ? (
                            <Link
                                to={`/shop/${category?.slug}`}
                                className="relative inline-block h-nav cursor-pointer border-b border-b-transparent px-4 py-2 font-inter text-sm font-bold uppercase tracking-wider transition-colors"
                            >
                                {category?.name}
                            </Link>
                        ) : (
                            <div
                                className="flex items-center justify-between"
                                onClick={() => {
                                    if (!category?.isCustom) handleToggleOpen(category, !category.isOpen);
                                }}
                            >
                                <Link
                                    to={`/shop/${category?.slug}`}
                                    className="relative inline-block cursor-pointer border-b border-b-transparent py-2 font-inter text-sm font-bold uppercase tracking-wider transition-colors"
                                >
                                    {category?.name}
                                </Link>
                                {!category?.isCustom && (
                                    <div>
                                        {!category?.isOpen ? (
                                            <PlusIcon className="size-4" />
                                        ) : (
                                            <MinusIcon className="size-4" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <input
                            type="checkbox"
                            checked={category?.isOpen}
                            onChange={(e) => {
                                handleToggleOpen(category, e.currentTarget.checked);
                            }}
                            className="hidden [&:checked+div]:grid-rows-[1fr]"
                        />
                        <div
                            className={`${!isMobile ? 'pointer-events-none absolute left-1/2 top-full flex h-auto w-[95%] -translate-x-1/2 translate-y-10 items-start gap-10 border bg-white opacity-0 shadow-md transition-all' : 'grid grid-rows-[0fr] py-1 transition-all duration-500'}`}
                        >
                            <div
                                className={`${!isMobile ? 'grid flex-1 grid-cols-2 gap-x-5 gap-y-10 pl-[5%] pt-[3%] tracking-wider' : 'overflow-hidden'}`}
                            >
                                {!category.child.every((child) => child.child.length === 0) ? (
                                    <React.Fragment>
                                        {category.child.map((child_lv2) => {
                                            return (
                                                <div key={child_lv2?._id}>
                                                    {!isMobile ? (
                                                        <span className="text-sm font-bold uppercase">
                                                            {child_lv2?.name}
                                                        </span>
                                                    ) : (
                                                        <div
                                                            className="flex items-center justify-between py-2 pl-4"
                                                            onClick={() =>
                                                                handleToggleOpen(child_lv2, !child_lv2.isOpen)
                                                            }
                                                        >
                                                            <span className="text-sm font-bold uppercase">
                                                                {child_lv2?.name}
                                                            </span>
                                                            {child_lv2?.child?.length > 0 && (
                                                                <div>
                                                                    {!child_lv2?.isOpen ? (
                                                                        <PlusIcon className="size-4" />
                                                                    ) : (
                                                                        <MinusIcon className="size-4" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        checked={child_lv2?.isOpen}
                                                        onChange={(e) => {
                                                            handleToggleOpen(child_lv2, e.currentTarget.checked);
                                                        }}
                                                        className="hidden [&:checked+div]:grid-rows-[1fr]"
                                                    />
                                                    <div
                                                        className={`${!isMobile ? 'mt-3' : 'grid grid-rows-[0fr] transition-all duration-500'}`}
                                                    >
                                                        <div className="overflow-hidden">
                                                            <div className={`*:block ${isMobile && 'pb-2'}`}>
                                                                {child_lv2.child.map((child_lv3) => {
                                                                    return (
                                                                        <Link
                                                                            key={child_lv3._id}
                                                                            to={`/shop/${child_lv3.slug}`}
                                                                            className={`w-fit ${isMobile && 'pl-8'}`}
                                                                        >
                                                                            <span
                                                                                className={`${!isMobile ? 'py-2 font-light opacity-70 transition-all hover:opacity-100' : 'inline-block py-2 text-sm font-semibold uppercase'}`}
                                                                            >
                                                                                {child_lv3.name}
                                                                            </span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ) : (
                                    <div>
                                        {!isMobile ? (
                                            <span className="text-sm font-bold uppercase">{category?.name}</span>
                                        ) : (
                                            <React.Fragment>
                                                {category.child.length == 0 && (
                                                    <span className="pl-4 text-sm font-bold uppercase">
                                                        {category?.name}
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        )}
                                        <div className={`${!isMobile ? 'mt-3' : 'pl-4'} *:block`}>
                                            {category.child.map((child) => {
                                                return (
                                                    <Link key={child._id} to={`/shop/${child.slug}`} className="w-fit">
                                                        <span
                                                            className={`${!isMobile ? 'py-2 font-light opacity-70 transition-all hover:opacity-100' : 'inline-block py-1 text-sm font-semibold uppercase'} `}
                                                        >
                                                            {child.name}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!isMobile && (
                                <div className="flex-1">
                                    <img
                                        src={category?.imageUrl}
                                        className="aspect-[1/0.8] w-full object-cover object-center"
                                        alt=""
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

Menu.propTypes = {
    categoryTree: PropTypes.array,
    isMobile: PropTypes.bool,
};

export default Header;
