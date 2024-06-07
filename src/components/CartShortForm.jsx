import { Link, useNavigate } from 'react-router-dom';
import CartItemMini from './CartItemMini';
import useCartStore from '../store/cartStore';

const CartShortForm = () => {
    const { cart } = useCartStore();
    const navigate = useNavigate();

    return (
        <>
            {/* Cart */}
            <input
                type="checkbox"
                className="peer/cart-short-form hidden [&:checked+div>div]:translate-x-0 [&:checked+div>label]:opacity-100"
                id="cart-short-form"
            />
            <div className="pointer-events-none invisible fixed right-0 top-0 z-50 h-screen w-screen peer-checked/cart-short-form:pointer-events-auto peer-checked/cart-short-form:visible">
                <label
                    htmlFor="cart-short-form"
                    className="block h-full w-full bg-[#3f3f3f80] opacity-0 transition-all duration-500"
                ></label>
                <div className="absolute right-0 top-0 flex h-full w-[30%] translate-x-full flex-col overflow-y-hidden bg-white p-[30px] transition-all duration-500 2xl:w-1/5">
                    <div className="mb-8 flex shrink-0 items-center justify-between">
                        <h4 className="tracking-wider">Cart ({cart?.items?.length})</h4>
                        <label htmlFor="cart-short-form" className="cursor-pointer text-2xl">
                            <i className="fa-light fa-xmark"></i>
                        </label>
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                        <div className="flex h-[55%] flex-col gap-8 overflow-y-auto pr-1 [scrollbar-width:thin]">
                            {cart?.items?.map((item, index) => {
                                return <CartItemMini key={index} item={item} />;
                            })}
                        </div>
                        {cart?.items?.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between py-8 text-lg font-bold tracking-wider">
                                    <h4>Subtotal</h4>
                                    <span>${cart?.subTotal}</span>
                                </div>
                                <div>
                                    <label
                                        htmlFor="cart-short-form"
                                        className="mb-3 block cursor-pointer py-4 text-center text-sm font-bold uppercase ring-1 ring-black transition-colors hover:text-[#d10202] hover:ring-[#d10202]"
                                        onClick={() => {
                                            navigate('/cart');
                                        }}
                                    >
                                        View cart
                                    </label>
                                    <Link className="block bg-black py-4 text-center text-sm font-bold uppercase text-white transition-colors hover:bg-[#d10202]">
                                        Check out
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartShortForm;
