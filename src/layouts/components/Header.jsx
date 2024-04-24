import { useEffect, useRef } from "react";
import { SearchItem } from "../../components";
import { Link } from "react-router-dom";
import CartItemMini from "../../components/CartItemMini";
const Header = () => {
    const header_el = useRef();
    useEffect(() => {
        window.addEventListener("scroll", () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                header_el.current.style.background = "white";
                header_el.current.classList.add("shadow-lg");
            } else {
                if (top == 0) {
                    header_el.current.classList.remove("shadow-lg");
                    header_el.current.style.background = "transparent";
                } else header_el.current.style.background = "white";
            }
        });
    }, []);

    return (
        <>
            <div
                ref={header_el}
                className="fixed left-0 top-0 z-50 flex h-[90px] w-full items-center justify-center bg-main transition-shadow duration-700"
            >
                <div className="container flex items-center justify-between gap-8 px-5">
                    <div className="relative flex items-center gap-4">
                        <input
                            type="checkbox"
                            id="menu"
                            className="peer/menu hidden [&+div_a.menu-link]:translate-y-1/2 [&+div_a.menu-link]:opacity-0 [&:checked+div_a.menu-link]:translate-y-0 [&:checked+div_a.menu-link]:opacity-100"
                            onChange={(e) => {
                                const isOpen = e.currentTarget.checked;
                                const logo = e.currentTarget.parentElement.nextElementSibling.children[0];
                                if (isOpen) {
                                    logo.classList.add("invert");
                                } else {
                                    logo.classList.remove("invert");
                                }
                            }}
                        />
                        <div
                            className="menu-clip-path fixed left-0 top-0 z-20 size-full bg-black peer-checked/menu:bg-[#191f22]"
                        >
                            <div className="container relative mx-auto flex h-fit items-start px-5 pt-[10%]">
                                <div className="flex shrink-0 basis-[50%] flex-col gap-5 text-white [&>*]:relative [&>*]:w-fit [&>*]:py-2 [&>*]:font-lora [&>*]:text-5xl [&>*]:before:absolute [&>*]:before:bottom-0 [&>*]:before:left-0 [&>*]:before:-z-10 [&>*]:before:h-full [&>*]:before:w-full [&>*]:before:origin-right [&>*]:before:scale-x-0 [&>*]:before:bg-white [&>*]:before:transition-[transform] [&>*]:before:duration-[200]">
                                    {["Home", "Light", "Table", "Chair", "Blog", "Contact us"].map(
                                        (menuItem, index) => {
                                            return (
                                                <Link
                                                    key={index}
                                                    className="menu-link ease-[cubic-bezier(0.86, 0, 0.07, 1)] transition-all duration-700 hover:px-3 hover:text-black hover:before:origin-left hover:before:scale-x-100"
                                                    style={{
                                                        transitionDelay: (index + 1) * 0.05 + "s",
                                                    }}
                                                >
                                                    {menuItem}
                                                </Link>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="cross menu--1 relative size-10 overflow-hidden">
                            <label
                                className="absolute -left-[30px] hover:opacity-70 top-1/2 z-50 size-20 -translate-y-1/2 cursor-pointer"
                                htmlFor="menu"
                                aria-checked="false"
                                onClick={(e) => {
                                    const isOpen = e.currentTarget.getAttribute("aria-checked");
                                    if (isOpen === "false") {
                                        e.currentTarget.setAttribute("aria-checked", "true");
                                    } else {
                                        e.currentTarget.setAttribute("aria-checked", "false");
                                    }
                                }}
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
                            src="src/assets/images/logo.png"
                            alt=""
                            className="w-full object-fill transition-all duration-700"
                        />
                    </Link>
                    <div className="flex items-center gap-8 [&>*>i]:cursor-pointer [&>*>i]:text-xl">
                        <Link className="hover:opacity-70">
                            <i className="fa-light fa-user"></i>
                        </Link>
                        <Link className="relative">
                            <i className="fa-light fa-heart hover:opacity-70"></i>
                            <div className="absolute -right-[45%] -top-[35%] flex size-5 items-center justify-center rounded-full bg-black text-white">
                                <span className="text-sm">0</span>
                            </div>
                        </Link>
                        <label className="relative" htmlFor="cart-short-form">
                            <i className="fa-light fa-cart-shopping hover:opacity-70"></i>
                            <div className="absolute -right-[30%] -top-[35%] flex size-5 items-center justify-center rounded-full bg-black text-white">
                                <span className="text-sm">0</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Search */}
            <input
                type="checkbox"
                className="peer/search-short-form hidden [&:checked~div>div]:translate-x-0 [&:checked~div>label]:opacity-100"
                id="search-short-form"
            />
            <div className="pointer-events-none invisible fixed right-0 top-0 z-50 h-screen w-screen peer-checked/search-short-form:pointer-events-auto peer-checked/search-short-form:visible">
                <label
                    htmlFor="search-short-form"
                    className="block h-full w-full bg-[#3f3f3f80] opacity-0 transition-all duration-500"
                ></label>
                <div className="absolute right-0 top-0 h-full w-[30%] translate-x-full overflow-y-auto [scrollbar-width:thin] bg-white p-[30px] transition-all duration-500 2xl:w-1/5">
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
                            className="h-[50px] w-full border border-gray-400 py-3 pl-8 pr-14 outline-none"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-2xl">
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

            {/* Cart */}
            <input
                type="checkbox"
                className="peer/cart-short-form hidden [&:checked~div>div]:translate-x-0 [&:checked~div>label]:opacity-100"
                id="cart-short-form"
            />
            <div className="pointer-events-none invisible fixed right-0 top-0 z-50 h-screen w-screen peer-checked/cart-short-form:pointer-events-auto peer-checked/cart-short-form:visible">
                <label
                    htmlFor="cart-short-form"
                    className="block h-full w-full bg-[#3f3f3f80] opacity-0 transition-all duration-500"
                ></label>
                <div className="absolute right-0 top-0 flex h-full w-[30%] translate-x-full flex-col overflow-y-hidden bg-white p-[30px] transition-all duration-500 2xl:w-1/5">
                    <div className="mb-8 flex shrink-0 items-center justify-between">
                        <h4 className="tracking-wider">Cart (0)</h4>
                        <label htmlFor="cart-short-form" className="cursor-pointer text-2xl">
                            <i className="fa-light fa-xmark"></i>
                        </label>
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                        <div className="cart-list-short flex h-[55%] flex-col gap-8 overflow-y-auto pr-1">
                            {[1, 2, 3].map((item, index) => {
                                return <CartItemMini key={index} />;
                            })}
                        </div>
                        <div>
                            <div className="flex items-center justify-between py-8 text-xl font-bold tracking-wider">
                                <h4>Subtotal</h4>
                                <span>$5,000</span>
                            </div>
                            <div>
                                <Link className="mb-3 block py-4 text-center text-base font-bold uppercase ring-1 ring-black transition-colors hover:text-[#d10202] hover:ring-[#d10202]">
                                    View cart
                                </Link>
                                <Link className="block bg-black py-4 text-center text-base font-bold uppercase text-white transition-colors hover:bg-[#d10202]">
                                    Check out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
